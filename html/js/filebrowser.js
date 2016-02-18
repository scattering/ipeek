(function () {
  var NEXUS_ZIP_REGEXP = /\.nxz\.[^\.\/]+$/
  
  function categorizeReflFiles(files, files_metadata, path, target_id, server_api) {
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
      //statusline_log("found file: " +  path + "/" + j + ", " + files_metadata[j].mtime);
      refl_promises.push(server_api.load_refl(path + "/" + j, files_metadata[j].mtime, refl_objs));
    });
    Promise.all(refl_promises).then(function(results) {
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
    });
  }
  
  var getCurrentPath = function(target_id) {
    // get the path from a specified path browser element
    var target_id = (target_id == null) ? "body" : target_id;
    var path = "";
    $(target_id).find(".patheditor span").each(function(i,v) {
      path += $(v).text();
    });
    return path;
  }

  function updateFileBrowserPane(target_id, pathlist, server_api, instrument_id) {
      function handler(dirdata) {
        var buttons = $("<div />", {class: "buttons"});
        var clear_all = $("<button />", {text: "clear all"});
        clear_all.click(function() {$("#"+target_id + " .remote_filebrowser").jstree("uncheck_all"); handleChecked()});
        buttons
          .append(clear_all)

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
              server_api.get_file_metadata(new_pathlist.slice(0, index+1))
              .then( function (metadata) {
                 updateFileBrowserPane(target_id, new_pathlist.slice(0, index+1), server_api, instrument_id)(metadata);
              })
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
            server_api.get_file_metadata(new_pathlist)
              .then( function (metadata) {
                 updateFileBrowserPane(target_id, new_pathlist, server_api, instrument_id)(metadata);
              }) 
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

        // instrument-specific categorizers 
        webreduce.instruments[instrument_id].categorizeFiles(files, metadata, pathlist.join("/"), target_id);

        //$(dirbrowser).selectable({
        //    filter:'td',
        //    stop: handleSelection
        //});
        //$(filebrowser).tablesorter();
      }
      return handler
  }
  webreduce = window.webreduce || {};
  webreduce.updateFileBrowserPane = updateFileBrowserPane;
  webreduce.getCurrentPath = getCurrentPath;
  webreduce.instruments = webreduce.instruments || {};
  webreduce.instruments['ncnr.refl'] = webreduce.instruments['ncnr.refl'] || {};
  webreduce.instruments['ncnr.refl'].categorizeFiles = categorizeReflFiles;

})();
