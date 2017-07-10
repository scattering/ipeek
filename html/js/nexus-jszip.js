/* require("DataStream.js"); */
/* require("jszip.js"); */

nz = {"version": 1};

format_DataStream_types = {
  "s": "readCString",
  "c": "readUInt8Array",
  "b": "readInt8Array",
  "B": "readUInt8Array",
  "h": "readInt16Array",
  "H": "readUInt16Array",
  "i": "readInt32Array",
  "I": "readUInt32Array",
  "l": "readInt32Array",
  "L": "readUInt32Array",
  "f": "readFloat32Array",
  "d": "readFloat64Array"
}

format_types = {
  "s": "String",
  "c": "Int",
  "b": "Int",
  "?": "Int",
  "h": "Int",
  "i": "Int",
  "l": "Int",
  "f": "Float",
  "d": "Float"
}


function fmt_to_DS(format_string) {
  // match format string to required DataStream reader
  //var endianness = endianness_lookup[format_string[0]];
  var ft = format_string[1];
  if (ft.toLowerCase() == "s") { 
    return "readCString" 
  } else {
    var bytes = parseInt(format_string[2]);
    var type = format_types[ft.toLowerCase()];
    var unsigned = (ft == ft.toUpperCase());
    return "read" + ((unsigned)? "U" : "") + type + (bytes*8).toFixed() + "Array";
  }
}

function fmt_endianness(format_string) {
  if (format_string[0] == "<") {
    return DataStream.LITTLE_ENDIAN;
  }
  else if (format_string[0] == ">") {
    return DataStream.BIG_ENDIAN;
  }
  else {
    throw "invalid format string: must start with < or >"
  }
}

function dirname(path) {
  var path = rstrip(path, "\/");
  var pathlist = path.split("/")
  return pathlist.slice(0, pathlist.length-1).join("/")
}

function rstrip(str, tostrip) {
  var tostrip = (tostrip == null) ? "\\s" : tostrip;
  var endregex = new RegExp(tostrip + tostrip + '*$')
  return str.replace(endregex, '');
}

function lstrip(str, tostrip) {
  var tostrip = (tostrip == null) ? '\\s' : tostrip;
  var startregex = new RegExp('^' + tostrip + tostrip + '*');
  return str.replace(startregex, '');
}

function strip (str, tostrip) {
  return rstrip(lstrip(str, tostrip), tostrip);
}

nz.Node = function() {}; // base class
nz.Node.prototype = {
  _attrs_filename: ".attrs",
  _link_filename: ".link",
  _type: "Node",
  
  init: function(parent, path, nxclass) {
    // handling of the arguments:
    // if _cache is not null, populate the cache for this node
    this.root = (parent == null) ? this : parent.root;
    this.readonly = this.root.readonly;
    if (path[0] == "/") {
      this.path = path;
    } else {
      this.path = rstrip(parent.path, "/") + "/" + path;
    }
    this.nxclass = nxclass;    
  },
  
  getAttrs: function() {
    // use cached value if not null:
    var attrs_path = lstrip(this.path + "/" + this._attrs_filename, "/");
    if (this.root._cache[attrs_path] == null) {     
      var attrs = JSON.parse(this.file_readText(attrs_path));
      this.root._cache[attrs_path] = attrs;
    };
    return this.root._cache[attrs_path];
  },
  
  getLink: function(path) {
    var link_path = lstrip(path + this._link_filename, "/");
    if (this.root._cache[link_path] == null) {     
      var link = JSON.parse(this.file_readText(link_path));
      this.root._cache[link_path] = link;
      // make sure there's an entry for the bare filename, too...
      this.root._cache[lstrip(path, "/")] = null;
    };
    return this.root._cache[link_path];
  },
  
  parent: function() {
    return this.root.get(dirname(this.path));
  },
    
  groupnames: function() {  
    var that = this;
    return this.keys().filter(function(fn) {
      var path = (fn[0] == "/") ? fn : rstrip(that.path, "/") + "/" + fn;
      return that.file_isdir(path)
    });
  },
  
  fieldnames: function() {
    var that = this;
    return this.keys().filter(function(fn) {return !(that.file_isdir(fn))});
  },
  
  keys: function() {
    //var nonkey_regex = /^[^\.]*$/;
    return this.file_listdir().filter(function(fn) {return fn.indexOf(".") < 0});// nonkey_regex.test(fn)});
  },
  
  items: function() {
    var that = this;
    return this.keys().map(function(fn) {
      return [fn, that.get(fn)] 
    });
  },
  
  contains: function(key) {
    return this.file_exists(this.path + "/" + key);
  },
  
  get: function(path) {
    // convert to full path:
    var that = this;
    var path = (path[0] == "/") ? path : rstrip(this.path, "/") + "/" + path;
    if (!(this.file_exists(path))) {
      //throw "key error";
      return null;
    }
    else if (this.file_isdir(path)) {
      var g = new nz.Group();
      g.init(this, path);
      return g;
    }
    else if (this.file_exists(path + this._attrs_filename)) {
      var f = new nz.Field();
      f.init(this, path);
      return f;
    }
    else if (this.file_exists(path + this._link_filename)) {
      return makeSoftLink(this, path, this.getLink(path).target);
    }
    else {
      throw "unknown element type"
    }
  },
  
  file_isdir: function(path) {
    var path = strip(path, "/") + "/";
    // root path is "/"
    return (path == "/" || path in this.root._cache || path in this.root.filenames) 
  },
  
  file_listdir: function(path) {
    // abstraction for looking up paths
    // should work for unpacked directories and packed zip archives
    var path = (path == null) ? this.path : path;
    path = lstrip(rstrip(path, "/") + "/", "/"); // never one on the left, always one on the right;
    var path_regex = new RegExp('^' + path + "([^/]+)/?$"); // some non-pathsep characters followed by optional single pathsep;
    var filenames = Object.keys(this.root.filenames);
    var direntries = filenames.filter(function(s) {return path_regex.test(s)}).map(function(fn) {return fn.match(path_regex)[1]});
    return direntries;
  },
  
  file_exists: function(path) {
    var path = strip(path, "/");
    return ( path in this.root._cache ||
             (path + "/") in this.root._cache ||
              path in this.root.filenames || 
             (path + "/") in this.root.filenames )
  },
  
  file_readText: function(path) {
    // returns a Promise, to be resolved with the data.
    // filenames in zip file do not have leading "/":
    var entry =  this.root.filenames[path];
    return entry.asText();
  },
  
  file_readArrayBuffer: function(path) {
    var entry = this.root.filenames[path];
    return entry.asArrayBuffer();
  },
  
  file_getsize: function(path) {
    var path = strip(path, "/");
    var entry = this.root.filenames[path];
    return (entry == null) ? null : entry.uncompressedSize;
  }
  
}

nz.File = function() { nz.Node.call(this); }
nz.File.prototype = new nz.Node();
nz.File.prototype.constructor = nz.File;
nz.File.prototype._type = "File"
nz.File.prototype.init = function(zipfilename, filenames, cache) {
  this._cache = cache || {};
  nz.Node.prototype.init.call(this, null, "/", "NXroot", {});
  this.zipfilename = zipfilename;
  this.mode = "r";
  this.filenames = filenames || {};
  return this;
}

nz.Group = function() { nz.Node.call(this); }
nz.Group.prototype = new nz.Node();
nz.Group.prototype.constructor = nz.Group;
nz.Group.prototype._type = "Group"
nz.Group.prototype.init = function(node, path) {
  nz.Node.prototype.init.call(this, node, path, "NXCollection");
  // precache the attrs?
  this.getAttrs();
  this.root._cache[strip(this.path, "/") + "/"] = null;
}

nz.Field = function() {};
nz.Field.prototype = {
  _attrs_suffix: ".attrs",
  _type: "Field",
  
  init: function(parent, path) {    
    this.root = parent.root;
    if (path[0] == "/") {
      this.path = path;
    } else {
      this.path = rstrip(parent.path, "/") + "/" + path;
    }
  },
  
  getAttrs: function() {
    // use cached value if not null:
    var attrs_path = lstrip(this.path + this._attrs_suffix, "/"); 
    if (this.root._cache[attrs_path] == null) {     
      var attrs = JSON.parse(this.root.file_readText(attrs_path));
      this.root._cache[attrs_path] = attrs;
    };
    return this.root._cache[attrs_path];
  },
  
  
  getValue: function() {
    var value_path = lstrip(this.path, "/");
    if (this.root._cache[value_path] == null) {     
      var root = this.root,
          path = lstrip(this.path, "/"),
          attrs,
          format_string;
      
      var attrs = this.getAttrs();
      format_string = attrs.format;
      if (attrs.binary) {
        // returns deferred
        var buf = root.file_readArrayBuffer(path);
        var ds = new DataStream(buf);
        ds.endianness = fmt_endianness(format_string);
        var reader = fmt_to_DS(format_string);
        var bytes_each = parseInt(format_string[2]);
        this.root._cache[value_path] = ds[reader](ds.byteLength / bytes_each);
      }
      else {    
        var valstr = root.file_readText(path);
        var accessor;
        if (/[fd]/.test(attrs.format[1].toLowerCase())) {
          accessor = function(d) {return d.map(parseFloat)};
        }
        else if (/[cbhil\?]/.test(attrs.format[1].toLowerCase())) {
          accessor = function(d) {return d.map(parseInt)};
        }
        else {
          accessor = function(d) {return d};
        }
        this.root._cache[value_path] = d3.tsv.parseRows(valstr, accessor); 
      }
    }
    return this.root._cache[value_path];
  }
  
}

function makeSoftLink(parent, path) {
  var linkinfo = parent.root.getLink(path);
  var target = linkinfo.target;
  var target_obj = parent.root.get(target);
  target_obj.orig_path = path;
  return target_obj;
}

function getValue(field) {
  if (field == null) { return null }
  else return field.getValue();
}
nz.getValue = getValue

function getAttrs(field) {
  return field.getAttrs();
}
nz.getAttrs = getAttrs;

function logj(value) {
  console.log(JSON.stringify(value));
  return value;
}

nz.cacheAll = function(node) {
  node.getAttrs();
  var itemname, itemobj, items = node.items();
  items.forEach(function(item,i) {
    itemname = item[0];
    itemobj = item[1];
    itemobj.getAttrs();
    if (itemobj.items) { nz.cacheAll(itemobj) }
    else if (itemobj.getValue) { itemobj.getValue(); }
  });
  return node._cache;
}

/*
'A': {en:m._EnArray, de:m._DeArray},
's': {en:m._EnString, de:m._DeString},
'c': {en:m._EnChar, de:m._DeChar},
'b': {en:m._EnInt, de:m._DeInt, len:1, bSigned:true, min:-Math.pow(2, 7), max:Math.pow(2, 7)-1},
'B': {en:m._EnInt, de:m._DeInt, len:1, bSigned:false, min:0, max:Math.pow(2, 8)-1},
'h': {en:m._EnInt, de:m._DeInt, len:2, bSigned:true, min:-Math.pow(2, 15), max:Math.pow(2, 15)-1},
'H': {en:m._EnInt, de:m._DeInt, len:2, bSigned:false, min:0, max:Math.pow(2, 16)-1},
'i': {en:m._EnInt, de:m._DeInt, len:4, bSigned:true, min:-Math.pow(2, 31), max:Math.pow(2, 31)-1},
'I': {en:m._EnInt, de:m._DeInt, len:4, bSigned:false, min:0, max:Math.pow(2, 32)-1},
'l': {en:m._EnInt, de:m._DeInt, len:4, bSigned:true, min:-Math.pow(2, 31), max:Math.pow(2, 31)-1},
'L': {en:m._EnInt, de:m._DeInt, len:4, bSigned:false, min:0, max:Math.pow(2, 32)-1},
'f': {en:m._En754, de:m._De754, len:4, mLen:23, rt:Math.pow(2, -24)-Math.pow(2, -77)},
'd': {en:m._En754, de:m._De754, len:8, mLen:52, rt:0}};
*/

