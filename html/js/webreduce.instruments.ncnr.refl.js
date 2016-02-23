// requires(webreduce.server_api)
webreduce = window.webreduce || {};
webreduce.instruments = webreduce.instruments || {};
webreduce.instruments['ncnr.refl'] = webreduce.instruments['ncnr.refl'] || {};

// define the loader and categorizers for ncnr.refl instrument
(function(instrument) {
  function load_refl(path, mtime, db){
    var template = {
      "name": "loader_template",
      "description": "ReflData remote loader",
      "modules": [
        {"module": "ncnr.refl.super_load", "version": "0.1", "config": {}}
      ],
      "wires": [],
      "instrument": "ncnr.magik",
      "version": "0.0"
    }
    var config = {"0": {"filelist": [{"path": path, "mtime": mtime}]}},
        module_id = 0,
        terminal_id = "output";
    return webreduce.server_api.calc_terminal(template, config, module_id, terminal_id).then(function(result) {
      if (db) { db[path] = result.values; }
      //console.log(result.result);
      if (webreduce.statusline_log) {
        webreduce.statusline_log("loaded: " + path);
      }
      return result.values
    })
  }
  
  function plot(file_objs, entry_ids) {
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
      var refl = file_objs[eid.path + '/' + eid.filename];
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
  
  instrument.plot = plot
  instrument.load_file = load_refl; 
  instrument.categorizers = [
    function(info) { return info.sample.name },
    function(info) { return info.intent || "unknown" },
    function(info) { return info.name },
    function(info) { return info.polarization || "unpolarized" }
  ];
    
})(webreduce.instruments['ncnr.refl']);

