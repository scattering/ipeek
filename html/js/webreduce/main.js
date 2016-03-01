webreduce = window.webreduce || {};
webreduce.instruments = webreduce.instruments || {};

(function webreduction() {
     //"use strict";
     // add a comment

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

    webreduce.hooks = {};
    webreduce.hooks.resize_center = null;

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
           west__size:          350
        ,  east__size:          300
        ,  south__size:         200
          // RESIZE Accordion widget when panes resize
        ,  west__onresize:	    $.layout.callbacks.resizePaneAccordions
        ,  east__onresize:	    $.layout.callbacks.resizePaneAccordions
        ,  south__onresize:     $.layout.callbacks.resizePaneAccordions
        ,  center__onresize:    webreduce.hooks.resize_center
      });

		  layout.toggle('east');
      //$.post(dirHelper, {'pathlist': $("#remote_path").val().split("/")}, function(r) { categorize_files(r.files)});

      // need to make field-datatype-specific client actions... for example, the super_load
      // module has fields with datatypes 'fileinfo', 'bool', 'bool', ...
      // for the fileinfo field, want to interact with the file chooser on the left panel
      // for the boolean inputs, want checkboxes.


      // require(d3, dataflow)
      webreduce.editor = {};
      webreduce.editor.create_instance = function(target_id) {
        // create an instance of the dataflow editor in
        // the html element referenced by target_id
        this._instance = new dataflow.editor();
        this._target_id = target_id;
      }
      webreduce.editor.handle_module_clicked = function() {
        // module group is 2 levels above module title in DOM
        var target = d3.select("#" + this._target_id);
        var index = d3.select(target.select(".module .selected").node().parentNode.parentNode).attr("index");
        var active_module = this._active_template.modules[index];
        var module_def = this._module_defs[active_module.module];
        var fields = module_def.fields || [];
        fields_dict = {};
        fields.forEach(function(f) {
          fields_dict[f.id] = f.default}
        );
        jQuery.extend(true, fields_dict, active_module.config);
        layout.open("east");
        webreduce.editor.make_form(fields, active_module);
        webreduce.editor.handle_fileinfo(fields, active_module);
      }
      webreduce.editor.handle_terminal_clicked = function() {
        var target = d3.select("#" + this._target_id);
        var selected = target.select(".module .selected");
        var index = d3.select(selected.node().parentNode.parentNode).attr("index");
        var terminal_id = selected.attr("terminal_id");
        console.log(index, terminal_id);
      }

      webreduce.editor.handle_fileinfo = function(fields, active_module) {
        var fileinfos = fields.filter(function(f) {return f.datatype == 'fileinfo'});
        fileinfos.forEach(function(fi) {
          var target = d3.select(".ui-layout-pane-east");
          var fi_div = target.append("div")
            .classed("fileinfo form", true)
            .style("border", "1px solid")

          var files = [];
          $(".remote_filebrowser").each(function() {
              var jstree = $(this).jstree(true);
              var checked_nodes = jstree.get_checked().map(function(s) {return jstree.get_node(s)});
              var fnodes = checked_nodes.filter(function(n) {
                return (n.li_attr.filename != null && n.li_attr.entryname != null)
              });
              var finfo = fnodes.map(function(n) {
                return {
                  'path': n.li_attr.filename,
                  'mtime': n.li_attr.mtime
                }});
              files = files.concat(finfo);
          });

          var existing_count = 0;
          if (active_module.config && active_module.config[fi.id] ) {
            existing_count = active_module.config[fi.id].length;
          }
          fi_div.append("label")
            .text(fi.id + "(" + existing_count + ")")
          .append("button")
            .text("accept selected (" + files.length + ")")
            .style("float", "right")
            .on('click', function() {
              active_module.config[fi.id] = files;
            })
          /*
          fi_div.append("ul")
            .selectAll("li.finfo").data(files)
            .enter().append("li")
              .classed("finfo", true)
              .text(function(d) {
                //var finfo = d.li_attr.filename.split('/').slice(-1).join('');
                //finfo += ":" + d.li_attr.entryname;
                //finfo += "," + d.li_attr.mtime;
                return "(" + files.length + ")";
              });
          */

        });
      }

      webreduce.editor.make_form = function(fields, active_module) {
        var data = [];
        var conversions = {
          'bool': 'checkbox',
          'float': 'number',
          'str': 'text'
        }
        for (var i=0; i<fields.length; i++) {
          var field = fields[i];
          var dt = field.datatype.split(":"),
              datatype = dt[0],
              units = dt[1];
          if (units === "") {units = "unitless"}
          if (datatype in conversions) {
            var value = (active_module.config && active_module.config[field.id])? active_module.config[field.id] : field.default;
            data.push({
              'type': conversions[field.datatype],
              'value': value,
              'checked': (value) ? true : false,
              'label': field.label + ((units === undefined) ? "" : "(" + units + ")"),
              'id': field.id
            });
          }
        }
        console.log(data);
        var target = d3.select(".ui-layout-pane-east");
        target.selectAll("div.form").remove();
        var forms = target.selectAll("div.form")
        .data([data]).enter()
        .append("div")
        .classed("form", true)
        .style("list-style", "none");

        forms.selectAll("li")
          .data(function(d) {return d})
          .enter()
          .append("li")
          .append("label")
          .text(function(d) {return d.label})
          .append("input")
          .attr("type", function(d) {return d.type})
          .attr("field_id", function(d) {return d.id})
          .attr("value", function(d) {return d.value})
          .property("checked", function(d) {return d.value})
          .on("change", function() {
            active_module.config = active_module.config || {};
            active_module.config[d3.select(this).attr('field_id')] = this.value;
          })
      }

      webreduce.editor.load_instrument = function(instrument_id) {
        var editor = this;
        editor._instrument_id = instrument_id;
        return webreduce.server_api.get_instrument(instrument_id)
          .then(function(instrument_def) {
            editor._instrument_def = instrument_def;
            editor._module_defs = {};
            if ('modules' in instrument_def) {
              for (var i=0; i<instrument_def.modules.length; i++) {
                var m = instrument_def.modules[i];
                editor._module_defs[m.id] = m;
              }
            }
            // load into the editor instance
            editor._instance.module_defs(editor._module_defs);
            // pass it through:
            return instrument_def;
          })
      }
      webreduce.editor.load_template = function(template_def) {
        this._instance.data([template_def]);
        this._active_template = template_def;
        var target = d3.select("#" + this._target_id);

        target.call(this._instance);

        target.selectAll(".module").classed("draggable wireable", false);

        target.selectAll(".module .terminal").on("click", function() {
          target.selectAll(".module .selected").classed("selected", false);
          d3.select(this).classed('selected', true);
          webreduce.editor.handle_terminal_clicked();
        });
        target.selectAll(".module g.title").on("click", function() {
          target.selectAll(".module .selected").classed("selected", false);
          d3.select(this).select("rect.title").classed("selected", true);
          webreduce.editor.handle_module_clicked();
        });
      }

      webreduce.editor.create_instance("bottom_panel");
      webreduce.editor.load_instrument(current_instrument)
        .then(function(instrument_def) { webreduce.editor.load_template(instrument_def.templates[0]); });
  }

})();
