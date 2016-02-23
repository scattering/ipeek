webreduce = window.webreduce || {};

(function filebrowser() {
     //"use strict";
    
    active_reduction = {
      "config": {},
      "template": {}
    }
    current_instrument = "ncnr.refl";
    var NEXUS_ZIP_REGEXP = /\.nxz\.[^\.\/]+$/
    var dirHelper = "listftpfiles.php";
    var data_path = ["ncnrdata"];
    var statusline_log = function(message) {
      var statusline = $("#statusline");
      if (statusline && statusline.html) {
        statusline.html(message);
      }
    }
    
    webreduce.statusline_log = statusline_log;
    
    function getUrlVars() {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    }

    var refl_objs = {};
    var start_time = (new Date()).getTime();
    var fileinfo;

    var primary_axis_pattern = {
      "SPEC": /trajectoryData\/_q$/,
      "BG": /trajectoryData\/_q$/,
      "BGP": /trajectoryData\/_q$/,
      "BGM": /trajectoryData\/_q$/,
      "SLIT": /trajectoryData\/_q$/,
      "ROCK": /sampleAngle\/softPosition$/
    }

    var primary_axis = {
      "specular": "Qz_target",
      "background+": "Qz_target",
      "background-": "Qz_target",
      "slit": "Qz_target",
      "intensity": "Qz_target", // what slit scans are called in refldata
      "rock qx": "Qx_target", // curve with fixed Qz
      "rock sample": "sample/angle_x", // Rocking curve with fixed detector angle
      "rock detector": "detector/angle_x" //Rocking curve with fixed sample angle
    }

    var get_refl_item = function(obj, path) {
      var result = obj,
          keylist = path.split("/");
      while (keylist.length > 0) {
        result = result[keylist.splice(0,1)];
      }
      return result;
    }

    var nexus_objs = {};

    function get_info(nz_obj) {
      var f = nz_obj, sout = {};
      var entry_names = f.groupnames();
      entry_names.forEach(function(entry) {
          sout[entry] = sout[entry] || {};
          var samplename = f.get(entry + "/sample/name");
          if (samplename == null) samplename = f.get(entry + "/DAS_logs/sample/name")
          sout[entry].samplename = (samplename == null) ? "noname" : samplename.getValue()[0][0];
          var scantype = f.get(entry + "/DAS_logs/trajectoryData/_scanType");
          sout[entry].scantype = (scantype == null) ? "uncategorized" : scantype.getValue()[0][0];
          sout[entry].counts = f.get(entry + "/DAS_logs/counter/liveROI").getValue().reduce(function(a, b) {return a.concat(b)});
          //var x = f.get(entry + "/data/x").getValue(),
          var x = f.get(entry + primary_axis[sout[entry].scantype]);
          if (x) {
            var xvals = x.getValue(),
              extent = d3.extent(xvals);
            sout[entry].min_x = extent[0][0];
            sout[entry].max_x = extent[1][0];
          }
      });
      return sout;
    }

    function make_range_icon(global_min_x, global_max_x, min_x, max_x) {
      var icon_width = 75;
      var rel_width = Math.abs((max_x - min_x) / (global_max_x - global_min_x));
      var width = icon_width * rel_width;
      var rel_x = Math.abs((min_x - global_min_x) / (global_max_x - global_min_x));
      var x = icon_width * rel_x;
      var output = "<svg class=\"range\" width=\"" + (icon_width + 2) + "\" height=\"12\">";
      output += "<rect width=\"" + width + "\" height=\"10\" x=\"" + x + "\" style=\"fill:IndianRed;stroke:none\"/>"
      output += "<rect width=\"" + icon_width + "\" height=\"10\" style=\"fill:none;stroke:black;stroke-width:1\"/>"
      output += "</svg>"
      return output
    }
    webreduce.make_range_icon = make_range_icon;
    // Dexie:

    var db = new Dexie("NexusDatafiles");
    db.version(nz.version)
      .stores({
        filenames: 'url,mtime,data'
      });

    db.open();
    //db.filenames.put({url: "//ncnr.nist.gov/pub/ncnrdata...", mtime: 12323452343, data: {}});
    //db.filenames.where("url").equalsIgnoreCase("//ncnr.nist.gov/pub" ).and("mtime").equals(1232145).each(function(item,cursor) {...})
    // .each returns a Promise, resolved with "undefined" after last iteration is complete.

    // DEPRECATED
    function categorize_files(files, files_metadata, path, target_id) {
      var t0 = new Date();
      var tree_entries = [],
          file_names = {},
          refl_promises = [];
      // some globals, because I'm a lazy/bad programmer:
      var fileinfo = {};
      var datafiles = files.filter(function(x) {return (
        NEXUS_ZIP_REGEXP.test(x) &&
        (/^(fp_)/.test(x) == false) &&
        (/^rapidscan/.test(x) == false) &&
        (/^scripted_findpeak/.test(x) == false)
        )});
      datafiles.forEach(function(j) {
        //console.log(path + "/" + j, files_metadata[j].mtime);
        statusline_log("found file: " +  path + "/" + j + ", " + files_metadata[j].mtime);
        refl_promises.push(load_refl(path + "/" + j, files_metadata[j].mtime, refl_objs));
      });
      Promise.all(refl_promises).then(function(results) {
        //for (var fn in refl_objs) {
        for (var i in datafiles) {
          var fn = path + "/" + datafiles[i];
          fileinfo[fn] = get_refl_info(refl_objs[fn]);
        }
        var treeinfo = finfo_to_tree(fileinfo, path);
        console.log(treeinfo);
        var jstree = $("#"+target_id + " .remote_filebrowser").jstree({
          "plugins": ["checkbox", "changed", "sort"],
          "checkbox" : {
            "three_state": true,
            //"cascade": "down",
            "tie_selection": false,
            "whole_node": false
          },
          "core": {"data": treeinfo}
        });
        $("#"+target_id + " .remote_filebrowser").on("check_node.jstree", handleChecked)
          .on("uncheck_node.jstree", handleChecked);
        $("#"+target_id + " .remote_filebrowser").on("click", "a", function(e) {
          if (!(e.target.classList.contains("jstree-checkbox"))) {
            $("#" + target_id + " .remote_filebrowser").jstree().toggle_node(e.currentTarget.id);
          }
        });
        console.log(new Date() - t0);
      });
      /*sequence.then(function() {
        //$("#result pre").html(JSON.stringify(fileinfo, null, 2));
        var treeinfo = finfo_to_tree(fileinfo, path);
        console.log(treeinfo);
        var jstree = $("#filebrowser").jstree({
          "plugins": ["checkbox", "changed"],
          "checkbox" : {
            "three_state": true,
            //"cascade": "down",
            "tie_selection": false,
            "whole_node": false
          },
          "core": {"data": treeinfo}
        });
        $("#filebrowser").on("check_node.jstree", handleChecked)
          .on("uncheck_node.jstree", handleChecked);
        $("#filebrowser").on("click", "a", function(e) {
          if (!(e.target.classList.contains("jstree-checkbox"))) {
            $("#filebrowser").jstree().toggle_node(e.currentTarget.id);
          }
        });
        console.log(new Date() - t0);

      })
      */
    }

    

    function handleChecked() {
      var xcol,
          datas = [],
          options={series: [], axes: {xaxis: {label: "x-axis"}, yaxis: {label: "y-axis"}}};
      $(".remote_filebrowser").each(function() {
        var jstree = $(this).jstree(true);
        //var selected_nodes = jstree.get_selected().map(function(s) {return jstree.get_node(s)});
        var checked_nodes = jstree.get_checked().map(function(s) {return jstree.get_node(s)});
        var plotnodes = checked_nodes.filter(function(n) {return n.li_attr.path != null});
        var plot_entry_ids = plotnodes.map(function(n) {
          return {path: n.li_attr.path, filename: n.id.split(":").slice(0,1).join(""), entryname: n.id.split(":").slice(-1).join("")}
        });
        var new_plotdata = plot(plot_entry_ids);
        options.series = options.series.concat(new_plotdata.series);
        datas = datas.concat(new_plotdata.data);
        if (xcol != null && new_plotdata.xcol != xcol) {
          throw "mismatched x axes in selection: " + xcol.toString() + " and " + new_plotdata.xcol.toString();
        }
        else {
          xcol = new_plotdata.xcol;
        }
      });
      //options.axes.xaxis.label = "Qz (target)";
      options.axes.xaxis.label = xcol;
      options.axes.yaxis.label = "counts/monitor";
      options.xtransform = $("#xscale").val();
      options.ytransform = $("#yscale").val();
      var mychart = new xyChart(options);
      d3.selectAll("#plotdiv svg").remove();
      d3.selectAll("#plotdiv").data([datas]).call(mychart);
      mychart.zoomRect(true);
    }

    
    function handleSelection() {console.log(selection)};

    function plot(entry_ids) {
      // entry_ids is list of {path: path, filename: filename, entryname: entryname} ids
      var series = new Array();
      var options = {
        series: series,
        legend: {show: true, left: 150},
        axes: {xaxis: {label: "x-axis"}, yaxis: {label: "y-axis"}}
      };
      var datas = [], xcol;
      var ycol = "detector/counts";
      var ynormcol = "monitor/counts";
      entry_ids.forEach(function(eid) {
        var refl = refl_objs[eid.path + '/' + eid.filename];
        var entry = refl.filter(function(e) {return ((e.name + e.polarization) == eid.entryname)});
        if (entry.length < 1) { return }
        else {entry = entry[0]};
        var intent = entry['intent'];
        var new_xcol = primary_axis[intent];
        if (xcol != null && new_xcol != xcol) {
          throw "mismatched x axes in selection: " + xcol.toString() + " and " + new_xcol.toString();
        }
        else {
          xcol = new_xcol;
        }
        var ydata = get_refl_item(entry, ycol);
        var xdata = get_refl_item(entry, xcol);
        var ynormdata = get_refl_item(entry, ynormcol);
        console.log(entry, ydata, xdata);
        var xydata = [], x, y, ynorm;
        for (var i=0; i<xdata.length || i<ydata.length; i++) {
          x = (i<xdata.length) ? xdata[i] : x; // use last value
          y = (i<ydata.length) ? ydata[i] : y; // use last value
          ynorm = (i<ynormdata.length) ? ynormdata[i] : ynorm; // use last value
          xydata[i] = [x,y/ynorm];
        }
        datas.push(xydata);
        series.push({label: eid.filename + ":" + eid.entryname});

      });
      ycol = "detector/counts";
      ynormcol = "monitor/counts";

      return {xcol: xcol, ycol: ycol, series: series, data: datas};
    } 

    window.onpopstate = function(e) {
      // called by load on Safari with null state, so be sure to skip it.
      //if (e.state) {
      var start_path = $.extend(true, [], data_path),
        url_vars = getUrlVars();
      if (url_vars.pathlist && url_vars.pathlist.length) {
        start_path = url_vars.pathlist.split("+");
      }
      webreduce.server_api.get_file_metadata(start_path).then(webreduce.updateFileBrowserPane("remote_source_1", start_path, current_instrument));
    }
    
    window.onpopstate();
    
    window.onload = function() {
      var layout = $('body').layout({
          west__size:			350
        ,	east__size:			200
        , south__size:    200
          // RESIZE Accordion widget when panes resize
        ,	west__onresize:		$.layout.callbacks.resizePaneAccordions
        ,	east__onresize:		$.layout.callbacks.resizePaneAccordions
        ,	south__onresize:		$.layout.callbacks.resizePaneAccordions
        , center__onresize:   handleChecked
		  });
		  
		  layout.toggle('east');
      //$.post(dirHelper, {'pathlist': $("#remote_path").val().split("/")}, function(r) { categorize_files(r.files)});
      //$("#filebrowser").on("changed.jstree", function (e, data) { console.log(this, e, data)});
      //$("#filebrowser").bind("check_node.jstree", function (e, data) { console.log(this, e, data)});
      $("#xscale, #yscale").change(handleChecked);
      var x0 = 10,
          y0 = 10, 
          dx = 135,
          dy = 40;

      
      
      var handle_module_clicked = function() {
        // module group is 2 levels above module title in DOM
        var index = d3.select(d3.select(".module .selected").node().parentNode.parentNode).attr("index");
        var active_module = active_reduction.template.modules[index];
        var module_def = instrument_def.modules.filter(function(m) { return (m.id === active_module.module )})[0] || {};
        var fields = module_def.fields || [];
        console.log(index, active_reduction.config[index], active_module, module_def.fields);
      }
      // need to make field-datatype-specific client actions... for example, the super_load
      // module has fields with datatypes 'fileinfo', 'bool', 'bool', ...
      // for the fileinfo field, want to interact with the file chooser on the left panel
      // for the boolean inputs, want checkboxes.
      
      var handle_terminal_clicked = function() {
        var index = d3.select(d3.select(".module .selected").node().parentNode.parentNode).attr("index");
        var terminal_id = d3.select(".module .selected").attr("terminal_id");
        console.log(index, terminal_id);
      }

      var e = new dataflow.editor();
      webreduce.server_api.get_instrument().then(function(result) {
        instrument_def = result;
        if ('modules' in instrument_def) {
          for (var i=0; i<instrument_def.modules.length; i++) {
            var m = instrument_def.modules[i];
            dataflow.module_defs[m.id] = m;
          }
        }
        e.data([instrument_def.templates[0]]);
        active_reduction.template = instrument_def.templates[0];
        d3.select("#bottom_panel").call(e);
        
        d3.selectAll(".module").classed("draggable wireable", false);

        d3.selectAll(".module .terminal").on("click", function() {
          d3.selectAll(".module .selected").classed("selected", false);
          d3.select(this).classed('selected', true);
          handle_terminal_clicked();
        });
        d3.selectAll(".module g.title").on("click", function() {
          d3.selectAll(".module .selected").classed("selected", false);
          d3.select(this).select("rect.title").classed("selected", true);
          handle_module_clicked();
        })
      });       
    }

})();
