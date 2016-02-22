// requires(server_api)
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
    return server_api.calc_terminal(template, config, module_id, terminal_id).then(function(result) {
      if (db) { db[path] = result.values; }
      //console.log(result.result);
      statusline_log("loaded: " + path);
      return result.values
    })
  }
  
  instrument.load_file = load_refl; 
  instrument.categorizers = [
    function(info) { return info.sample.name },
    function(info) { return info.intent || "unknown" },
    function(info) { return info.name },
    function(info) { return info.polarization || "unpolarized" }
  ];
    
})(webreduce.instruments['ncnr.refl']);

