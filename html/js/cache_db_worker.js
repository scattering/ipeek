importScripts('Dexie.js', 'zip/jszip.min.js', 'DataStream.js', 'nexus-jszip.js', '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js');

var db = new Dexie("NexusDatafiles");
db.version(nz.version)
  .stores({
    filenames: 'url,mtime,data'
  });

db.open();

function handleAB(args) {
  var url = args[1];
  var ab = args[0];
  var mtime = args[2];
  db.filenames.where("url").equals(url).first(function(a) {
    if (a == undefined) {
      var zip = new JSZip(ab);
      var sout = {};
      var f = new nz.File().init(url, zip.files);
      db.filenames.put({url: url, mtime: mtime, data: nz.cacheAll(f)}) 
    }
  });
  //postMessage(js_cache);
  postMessage(url);
}

var rejectAB = function(error) {
  console.error("Failed!", error);
};


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

onmessage = function(e) {
  console.log('Message received from main script', e);
  var filenames = e.data.filenames,
      path = e.data.path,
      mtimes = e.data.mtimes;
  var sequence = Promise.resolve();
  for (var i=0; i<filenames.length; i++) {
     var ga = (function(i) { return function() {return getArrayBuffer(path, filenames[i], mtimes[i]).then(handleAB, rejectAB)} })(i);
     sequence = sequence.then(ga);
  }
  //getArrayBuffer(path, filename).then(handleAB, rejectAB);
  //postMessage(workerResult);
}

onerror = function(e) {
  console.error(e);
}

