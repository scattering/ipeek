(function filebrowser() {
     "use strict";

    var NEXUS_ZIP_REGEXP = /\.nxz\.[^\.\/]+$/
    var dirHelper = "listftpfiles.php";
    var data_path = ["ncnrdata"];

    //zip.workerScripts = {
    //  deflater: ['js/zip/z-worker.js', 'js/zip/zlib.js', 'js/zip/zlib-asm/codecs.js'],
    //  inflater: ['js/zip/z-worker.js', 'js/zip/zlib.js', 'js/zip/zlib-asm/codecs.js']
    //};
    //zip.workerScriptsPath = "js/zip/";
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
    function getArrayBuffer(base_url, filename, mtime) {
      // Return a new promise.
      var url = base_url + "/" + filename;
      return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.responseType = 'arraybuffer'

        req.onload = function() {
          // This is called even on 404 etc
          // so check the status
          if (req.status == 200) {
            // Resolve the promise with the response text
            resolve([req.response, url, mtime]);
          }
          else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject(Error(req.statusText));
          }
        };

        // Handle network errors
        req.onerror = function() {
          reject(Error("Network Error"));
        };

        // Make the request
        req.send();
      });
    }


    function getTextData(entry) {
      return new Promise(function(resolve, reject) {
        if (entry == null) { resolve(null); return }
        else {
          entry.getData(new zip.TextWriter(), function(text) { resolve(text) });
        }
      });
    }

    function getJSONData(entry) {
      return new Promise(function(resolve, reject) {
        if (entry == null) { resolve(null); return }
        else {
          entry.getData(new zip.TextWriter(), function(text) { resolve(JSON.parse(text)) });
        }
      });
    }

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

    function readData(entries, path) {
      // first, get the attributes:
      var attrs_file = path + ".attrs";
      var attrs_entry = entries.filter(function(e,i,a) { return (e.filename == attrs_file) })
      if (attrs_entry.length < 1) { throw "key error: " + attrs_file }
      getTextData(attrs_entry[0]).then(function(a) {
        var attrs = JSON.parse(a);
        if (attrs.binary) {
          console.log("binary read not implemented yet");
          return Promise.resolve(null);
        }
        else {

        }
      });
    }

    function flatten(array) {
      if (array.constructor.name == "Array") {
        return flatten(array[0]);
      }
      else {
        return array;
      }
    }
    var nexus_objs = {};

    function handleZip(url, zip) {
      var sout = {};
      var f = new nz.File().init(url, f.files);
      //nexus_objs[url.split("/").slice(-1)] = f;
      nexus_objs[url] = f;
      var entry_names = f.groupnames();
      entry_names.forEach(function(entry) {
          sout[entry] = sout[entry] || {};
          sout[entry].samplename =  f.get(entry + "/sample/name").getValue()[0][0];
          sout[entry].scantype =  f.get(entry + "/DAS_logs/trajectoryData/_scanType").getValue()[0][0];

      });
      console.log(entry_names);
      return sout;
    }
    function handleAB(args) {
      var url = args[1],
          ab = args[0],
          mtime = args[2];

      var zip = new JSZip(ab);
      //console.log(zip);
      var f = new nz.File().init(url, zip.files);
      f.mtime = mtime;
      //nexus_objs[url.split("/").slice(-1)] = f;
      nexus_objs[url] = f;
      console.log(url);
    }

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

    function get_refl_info(refl_obj) {
      var f = refl_obj, sout = {};
      refl_obj.forEach(function(entry_obj) {
        var samplename = entry_obj['sample']['name']
        var entry = entry_obj['name'] + entry_obj['polarization']
        sout[entry] = sout[entry] || {};
        sout[entry].samplename = (samplename == null) ? "noname" : samplename;
        var scantype = entry_obj['intent'];
        sout[entry].scantype = (scantype == null) ? "uncategorized" : scantype;
        sout[entry].counts = entry_obj['detector']['counts'];
        //var x = f.get(entry + "/data/x").getValue(),
        var x = entry_obj['Qz_target']
        if (x) {
          var extent = d3.extent(x);
          sout[entry].min_x = extent[0];
          sout[entry].max_x = extent[1];
        }
      });
      return sout;
    }

    function rejectAB(error) {
      console.error("Failed!", error);
    };

    function finfo_to_tree(finfo, path){
      var out = [], sample_names = {};
      console.log(Object.keys(finfo));
      for (var fn in finfo) {
        var fn_info = finfo[fn];
        var short_fn = fn.split("/").slice(-1)[0];
        for (var entry in fn_info) {
          var info = fn_info[entry];
          var samplename = info.samplename,
              scantype = info.scantype || "unknown";
          if (!info.samplename) {
            samplename = short_fn.split(".").slice(0)[0];
          }
          sample_names[samplename] = sample_names[samplename] || {};
          sample_names[samplename][scantype] = sample_names[samplename][scantype] || {};
          // min_x and max_x for a file are grabbed from the first entry that pops up:
          sample_names[samplename][scantype][short_fn] = sample_names[samplename][scantype][short_fn] || {min_x: info.min_x, max_x: info.max_x};
          out.push({
            "id": short_fn+":"+entry,
            "parent": short_fn,
            //"text": fn + ":" + entry,
            "text": entry,
            "icon": false,
            "li_attr": {"path": path, "min_x": info.min_x, "max_x": info.max_x}
          });
        }
      }
      for (var sn in sample_names) {
        out.push({"id": sn, "parent": "#", "text": sn});
        var sample_obj = sample_names[sn];
        for (var t in sample_obj) {
          var type_obj = sample_obj[t];
          var global_min_x = Infinity,
              global_max_x = -Infinity;
          for (var fn in type_obj) {
            // once through to get max and min...
            var f_obj = type_obj[fn];
            global_min_x = Math.min(f_obj.min_x, global_min_x);
            global_max_x = Math.max(f_obj.max_x, global_max_x);
          }
          for (var fn in type_obj) {
            // and again to make the range icon.
            var f_obj = type_obj[fn];
            var range_icon = make_range_icon(global_min_x, global_max_x, f_obj.min_x, f_obj.max_x);
            out.push({"id": fn, "parent": sn + ":" + t, "text": "<span>"+fn+"</span>" + range_icon, "icon": false, "li_attr": {"min_x": f_obj.min_x, "max_x": f_obj.max_x, "class": "datafile"}});
          }
          out.push({"id": sn + ":" + t, "parent": sn, "text": t, "li_attr": {"min_x": global_min_x, "max_x": global_max_x}});
        }
      }
      return out;
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
        console.log(path + "/" + j, files_metadata[j].mtime);
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

    function load_refl(path, mtime, db){
      var promise = new Promise(function(resolve, reject) {
        var template = {
          "name": "loader_template",
          "description": "ReflData remote loader",
          "modules": [{"module": "ncnr.refl.load", "version": "0.1", "config": {}}],
          "wires": [],
          "instrument": "ncnr.magik",
          "version": "0.0"
        }
        var config = {"0": {"files": [{"path": path, "mtime": mtime}]}},
            module_id = 0,
            terminal_id = "output";

        $.jsonRPC.request('calc_dict', {
          async: true,
          params: [template, config, module_id, terminal_id],
          success: function(result) {
              if (db) { db[path] = result.result; }
              console.log(result.result);
              resolve(result.result);
          },
          error: function(result) {console.log('error: ', result); reject(result);}
        });
      });
      return promise;
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

    function get_template() {

    }

    function add_remote_source(path) {
      var remote_source_count = $("#navigation div.remote_filebrowser").length;
      var new_id = "remote_source_" + (remote_source_count + 1).toFixed();
      var new_div = $("<div />", {"id": new_id})
      $("#processed_data").before(new_div);
      $.jsonRPC.request('get_file_metadata', {
          async: true,
          params: [path],
          success: function(result) {
              metadata = JSON.parse(result.result);
              updateFileBrowserPane(new_id, path)(metadata);
          },
          error: function(result) {console.log('error: ', result)}
      });

    }

    var caching_worker = new Worker('js/cache_db_worker.js');
    //caching_worker.onmessage = function(x) { console.log(x) };

    function webworker_cache_objs(files, metadata, path) {
      var mtimes = files.map(function(fn) { return metadata[fn].mtime });
      var data = {filenames: files, mtimes: mtimes, path: path};
      caching_worker.postMessage(data);
    }

    function cache_nexus_objs(nzobjs) {
      // deprecated
      for (var url in nzobjs) {
        var nxz = nzobjs[url];
        db.filenames.put({url: url, mtime: nxz.mtime, data: nz.cacheAll(nxz)});
      }
    }

    function getCurrentPath(target_id) {
      // get the path from a specified path browser element
      var target_id = (target_id == null) ? "body" : target_id;
      var path = "";
      $(target_id).find(".patheditor span").each(function(i,v) {
        path += $(v).text();
      });
      return path;
    }

    function updateFileBrowserPane(target_id, pathlist) {
      console.log(target_id, $("#" + target_id));
        function handler(dirdata) {
            var buttons = $("<div />", {class: "buttons"});
            var clear_all = $("<button />", {
                text: "clear all"
            });
            clear_all.click(function() {$("#"+target_id + " .remote_filebrowser").jstree("uncheck_all"); handleChecked()});
            //var download_all = $("<button />", {
            //    text: "download selected"
            //});
            //download_all.click(function() {
            //    $("#"+target_id + " input:checked").each(function() {$(this).parent().parent().find("a span").trigger("click")});
            //});
            buttons
              .append(clear_all)
              //.append(download_all);

            var files = dirdata.files,
                metadata = dirdata.files_metadata;
            files.sort(function(a,b) { return dirdata.files_metadata[b].mtime - dirdata.files_metadata[a].mtime });
            // dirdata is {'subdirs': list_of_subdirs, 'files': list_of_files, 'pathlist': list_of_path

            var patheditor = document.createElement('div');
            patheditor.className = 'patheditor';
            var subdiritem, dirlink, new_pathlist;
            if (pathlist.length > 0) {
                var new_pathlist = $.extend(true, [], pathlist);
                $.each(new_pathlist, function(index, pathitem) {
                    dirlink = document.createElement('span');
                    dirlink.textContent = pathitem + "/";
                    dirlink.onclick = function() {
                        history.pushState({}, "", "?pathlist=" + new_pathlist.slice(0, index+1).join("+"));
                        $.jsonRPC.request('get_file_metadata', {
                            params: [new_pathlist.slice(0, index+1)],
                            success: function(result) {
                                var metadata = JSON.parse(result.result);
                                updateFileBrowserPane(target_id, new_pathlist.slice(0, index+1))(metadata);
                            },
                            error: function(result) {console.log('error: ', result)}
                        });
                        //$.post(dirHelper, {'pathlist': new_pathlist.slice(0, index+1)}, updateFileBrowserPane(target_id, new_pathlist.slice(0, index+1)));
                    }
                    patheditor.appendChild(dirlink);
                });
            }

            var dirbrowser = document.createElement('ul');
            dirbrowser.id = "dirbrowser";
            dirdata.subdirs.reverse();
            $.each(dirdata.subdirs, function(index, subdir) {
                subdiritem = document.createElement('li');
                subdiritem.classList.add('subdiritem');
                subdiritem.textContent = "(dir) " + subdir;
                var new_pathlist = $.extend(true, [], pathlist);
                new_pathlist.push(subdir);
                subdiritem.onclick = function() {
                    history.pushState({}, "", "?pathlist=" + new_pathlist.join("+"));
                    $.jsonRPC.request('get_file_metadata', {
                        params: [new_pathlist],
                        success: function(result) {
                            var metadata = JSON.parse(result.result);
                            updateFileBrowserPane(target_id, new_pathlist)(metadata);
                        },
                        error: function(result) {console.log('error: ', result)}
                    });
                    //$.post(dirHelper, {'pathlist': new_pathlist}, updateFileBrowserPane(target_id, new_pathlist));
                }
                dirbrowser.appendChild(subdiritem);
            });

            var deadtime_choose = document.createElement('div');
            deadtime_choose.classList.add("deadtime-chooser");
            var deadtime_text = document.createElement('span');
            deadtime_text.textContent = "deadtime correct:";
            deadtime_choose.appendChild(deadtime_text);
            var deadtime_detector = document.createElement('label');
            deadtime_detector.textContent = "det";
            var deadtime_detector_select = document.createElement('input');
            deadtime_detector_select.type = "checkbox";
            deadtime_detector_select.checked = true;
            deadtime_detector.appendChild(deadtime_detector_select);
            deadtime_choose.appendChild(deadtime_detector);
            var deadtime_monitor = document.createElement('label');
            deadtime_monitor.textContent = "mon";
            var deadtime_monitor_select = document.createElement('input');
            deadtime_monitor_select.type = "checkbox";
            deadtime_monitor_select.checked = true;
            deadtime_monitor.appendChild(deadtime_monitor_select);
            deadtime_choose.appendChild(deadtime_monitor);

            var filebrowser = document.createElement('div');
            //filebrowser.id = "filebrowser";
            filebrowser.classList.add("remote_filebrowser");
            //filebrowser.classList.add("tablesorter");


            $('#' + target_id).empty()
              .append(buttons)
              .append(patheditor)
              .append(deadtime_choose)
              .append(dirbrowser)
              .append(filebrowser);

            categorize_files(files, metadata, pathlist.join("/"), target_id);

            //$(dirbrowser).selectable({
            //    filter:'td',
            //    stop: handleSelection
            //});
            //$(filebrowser).tablesorter();
        }
        return handler
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

    function get_file_metadata(e) {
      var start_path = $.extend(true, [], data_path),
          url_vars = getUrlVars();
      if (url_vars.pathlist && url_vars.pathlist.length) {
          start_path = url_vars.pathlist.split("+");
      }
      $.jsonRPC.request('get_file_metadata', {
          async: true,
          params: [start_path],
          success: function(result) {
              var metadata = JSON.parse(result.result);
              updateFileBrowserPane("remote_source_1", start_path)(metadata);
          },
          error: function(result) {console.log('error: ', result)}
      });
      //$.post(dirHelper, {'pathlist': start_path}, updateFileBrowserPane("remote_source_1", start_path));
    }

    $.jsonRPC.setup({
      //endPoint: '//localhost:' + rpc_port + '/RPC2',
      endPoint: "//localhost:8001/RPC2",
      namespace: '',
      cache: false
    });

    window.onpopstate = function(e) {
      // called by load on Safari with null state, so be sure to skip it.
      if (e.state) {
        get_file_metadata();
      }
    }

    window.onload = function() {
      var layout = $('body').layout({
          west__size:			350
        ,	east__size:			0
        , south__size:    150
          // RESIZE Accordion widget when panes resize
        ,	west__onresize:		$.layout.callbacks.resizePaneAccordions
        ,	east__onresize:		$.layout.callbacks.resizePaneAccordions
        ,	south__onresize:		$.layout.callbacks.resizePaneAccordions
		  });
		
      //$.post(dirHelper, {'pathlist': $("#remote_path").val().split("/")}, function(r) { categorize_files(r.files)});
      //$("#filebrowser").on("changed.jstree", function (e, data) { console.log(this, e, data)});
      //$("#filebrowser").bind("check_node.jstree", function (e, data) { console.log(this, e, data)});
      $("#xscale, #yscale").change(handleChecked);
      var x0 = 10,
          y0 = 10, 
          dx = 135,
          dy = 40;

      var module_opts = [
        {
          title: "load spec",
          inputs: [],
          outputs: ["out"],
          x: x0,
          y: y0
        },
        {
          title: "load bg",
          inputs: [],
          outputs: ["out"],
          x: x0,
          y: y0 + dy
        },
        {
          title: "load slit",
          inputs: [],
          outputs: ["out"],
          x: x0,
          y: y0 + 2*dy
        },
        {
          title: "mask",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + dx,
          y: y0
        },
        {
          title: "mask",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + dx,
          y: y0 + dy
        },
        {
          title: "mask",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + dx,
          y: y0 + 2*dy
        },
        {
          title: "join",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + 2*dx,
          y: y0
        },
        {
          title: "join",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + 2*dx,
          y: y0 + dy
        },
        {
          title: "attenuate",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + 2*dx,
          y: y0 + 2*dy
        },
        {
          title: "join",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + 3*dx,
          y: y0 + 2*dy
        },
        {
          title: "subtract",
          inputs: ["subtrahend", "minuend"],
          outputs: ["out"],
          x: x0 + 3*dx,
          y: y0
        },
        {
          title: "normalize",
          inputs: ["numerator", "denominator"],
          outputs: ["out"],
          x: x0 + 4*dx,
          y: y0 + dy
        },
        {
          title: "footprint",
          inputs: ["in"],
          outputs: ["out"],
          x: x0 + 5*dx,
          y: y0 + dy
        },
        
      ];

      var opts = {
          modules: module_opts,
          wires: [
              {src: "0:out", tgt: "3:in"},
              {src: "1:out", tgt: "4:in"},
              {src: "2:out", tgt: "5:in"},
              {src: "3:out", tgt: "6:in"},
              {src: "4:out", tgt: "7:in"},
              {src: "5:out", tgt: "8:in"},
              {src: "8:out", tgt: "9:in"},
              {src: "6:out", tgt: "10:subtrahend"},
              {src: "7:out", tgt: "10:minuend"},
              {src: "10:out", tgt: "11:numerator"},
              {src: "9:out", tgt: "11:denominator"},
              {src: "11:out", tgt: "12:in"}
          ]
      }

      var e = new dataflow.editor();
      e.data([opts]);
      d3.select("#bottom_panel").call(e);
      d3.selectAll(".module").classed("draggable wireable", false);
    }

})();
