"use strict"
window.onload = function(){
  zip.useWebWorkers = false;
  var container = document.getElementById('dataviewer');
  var w = container.offsetWidth-8;
  var h = container.offsetHeight-8;
  var numImages,
    galleryRadius,
    starCloud,
    origin,
    imagesLoaded = false,
    mouseDown = false,
    images = [],
    keyDown = [],
    starPaths=[],
    speedCoeff=0.2,
    yaxis = new THREE.Vector3(0,1,0),
    scene = new THREE.Scene().add( new THREE.AmbientLight(0xffffff) ),
    camera = new THREE.PerspectiveCamera( 45, w/h, 0.1, 10000 );
  
  scene.add(camera);
  scene.background = new THREE.Color("white");
  var renderer = new THREE.WebGLRenderer();
  window.renderer = renderer;
  container.appendChild(renderer.domElement);
  var element = renderer.domElement;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( w, h );
  
  var locked_view = true;
  var controls = new THREE.OrbitControls( camera, element );
  controls.target.set(0,0,-750);
  controls.enableZoom = true;
  controls.enablePan = false;
	controls.enableDamping = true;
	controls.rotateSpeed = - 0.03;
  controls.saveState();
  controls.enabled = false;
  
  
  window.camera = camera;
  var reset_position = {};
  function save_view() {
    reset_position.zoom = camera.zoom;
    reset_position.z = camera.position.z;
    reset_position.angle_x = camera.rotation.x;
    reset_position.angle_y = camera.rotation.y;
  }
  save_view();
  
  function restore_view() {
    camera.zoom = reset_position.zoom;
    camera.position.z = reset_position.z;
    camera.rotation.x = reset_position.angle_x;
    camera.rotation.y = reset_position.angle_y;
    camera.updateProjectionMatrix();
  }

  window.textures = {};
  var datasets = [];
  var textures = [];
  var zmin = Infinity;
  var zmax = -Infinity;
  loadImages();
  function loadImages(){
    //if(!imagesLoaded) return(false);

    //Unload
    images.forEach(function(image){ scene.remove(image); });
    images = [];
    document.body.classList.remove('imagesLoaded');

    //camera.position.set(0,0,0.1);
    //controls.update();
    //camera.rotation.x = 0.2;

    //Load
    var detectors = [
      "frontBottomAreaDetector",
      "frontLeftAreaDetector",
      "frontRightAreaDetector",
      "frontTopAreaDetector",
      "middleBottomAreaDetector",
      "middleLeftAreaDetector",
      "middleRightAreaDetector",
      "middleTopAreaDetector",
      "rearAreaDetector"
    ];
    var short_detectors = ["MB", "MT", "ML", "MR", "FT", "FB", "FL", "FR"];
    //var short_detectors = ["MB", "MT", "ML", "FT", "FB", "FL", "FR"];
    numImages = short_detectors.length;
    var tube_coefficients = {
      "HORIZONTAL": [-266.0, 4.16, 0.0],
      "VERTICAL": [-521.0, 8.14, 0.0]
    }
    
    var keys_to_get = [
      "tube_orientation", 
      "setback", 
      "x_pixel_size", 
      "y_pixel_size", 
      "vertical_offset", 
      "lateral_offset",
      "pixel_num_x",
      "pixel_num_y",
      "panel_gap",
      "distance",
      "data"
    ]
      
    
    var myRequest = new Request('https://ncnr.nist.gov/ipeek/data/VSANS/live_data.nxz');
    var filename = "live_data";
    var f;
    console.time('fetch');
    fetch(myRequest).then(function(response) {
      console.timeEnd('fetch');
      return response.blob();
      
    }).then(function(blob) {
      return new Promise(function(resolve, reject) {
        console.time('entry');
        zip.createReader(
          new zip.BlobReader(blob), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
              f = new nz.File().init(filename, entries);
              var entry;
              f.get(f.groupnames()[0])
                .then(function(en) { 
                  entry = en;
                  console.timeEnd('entry');
                  resolve(en);
                });
            });
          });
      })
    }).then(function(entry) {
      var fov = 0;
      for(var i=0; i < short_detectors.length; i++){ loadDetector(i); }
      async function loadDetector(ind){
        var sname = short_detectors[ind];
        var dname = "detector_" + sname;
        var cmap_array = colormap_array(colormap.get_colormap('jet'));
        entry.get("instrument/" + dname).then(async function(det) {
          // get all values:
          let values = {};
          let attrs = {};
          var promises = [];
          /*
          for (let k of det.keys()) {
            if (!keys_to_get.includes(k)) { continue }
            console.time('d_' + ind + '_k_' + k);
            let f = await det.get(k).then(function(field) { 
              if (field == null) {
                return [null, [[null]]]
              } else {
                return Promise.all([field.getAttrs(), field.getValue()]);
              }
              //return (field == null) ? {[[null]] : field.getValue() });
            });
            console.timeEnd('d_' + ind + '_k_' + k);
            //let value = await det.get(k).then(function(field) { return (field == null) ? [[null]] : field.getValue() });
            values[k] = f[1];
            attrs[k] = f[0];
          }
          */
          for (let k of det.keys()) {
            if (!keys_to_get.includes(k)) { continue }
            promises.push(det.get(k).then(function(field) {
              if (field == null) {
                values[k] = [[null]];
                attrs[k] = null;
                return true;
              } else {
                return field.getAttrs().then(function(a) {
                  attrs[k] = a;
                  return field.getValue();
                }).then(function(v) {
                  values[k] = v;
                });
              }
            }));
          }
          let done = await Promise.all(promises);
          let z_offset = (values.setback || [[0]])[0][0];
          var x_pixel_size, y_pixel_size;
          let inline_pixel_size = 0.75;
          var orientation = values.tube_orientation[0][0].toUpperCase();
          var coeffs = tube_coefficients[orientation];
          var lateral_offset = 0;
          var vertical_offset = 0;
          let panel_gap = values.panel_gap[0][0]/10; // mm to cm;
          if (orientation == "VERTICAL") {
            x_pixel_size = values.x_pixel_size[0][0] / 10; // mm to cm
            y_pixel_size = coeffs[1] / 10; // mm to cm 
            lateral_offset = values.lateral_offset[0][0]; // already cm
          } else {
            x_pixel_size = coeffs[1] / 10;
            y_pixel_size = values.y_pixel_size[0][0] / 10; // mm to cm
            vertical_offset = values.vertical_offset[0][0]; // already cm
          }
          let dim_x = parseInt(values.pixel_num_x[0][0]);
          let dim_y = parseInt(values.pixel_num_y[0][0]);
          let size_x = x_pixel_size * dim_x;
          let size_y = y_pixel_size * dim_y;
          let x_offset = x_pixel_size/2; // cm
          let y_offset = y_pixel_size/2; // cm
          let z = -(values.distance[0][0] + z_offset);
          let angle_subtended_y = 2*180/Math.PI * Math.atan2(size_y/2, -z);
          let angle_subtended_x = 2*180/Math.PI * Math.atan2(size_x/2, -z);
          fov = Math.max(fov, angle_subtended_y, h/w*angle_subtended_x);
          camera.fov = fov;
          let solid_angle_correction = Math.pow(z, 2) / 1e6;
          let flattened = (attrs.data.binary) ? Array.prototype.slice.call(values.data) : (flatten_data(values.data)).data;
          var zmin_local = Infinity;
          var zmax_local = -Infinity;
          let corrected = flattened.map(function(d) { 
            let corr = (d * solid_angle_correction);
            zmin_local = (corr < zmin_local) ? corr : zmin_local;
            zmax_local = (corr > zmax_local) ? corr : zmax_local;
            return corr;
          });
          var recalculate_colors = false;
          if (zmax_local > zmax) { 
            zmax = zmax_local;
            recalculate_colors = true;
          }
          if (zmin_local < zmin) {
            zmin = zmin_local;
            recalculate_colors = true;
          }
          
          let datasize = flattened.length;
          //let plotdata = new Uint8ClampedArray(datasize);
          let dataset = new Float64Array(datasize);
          let scale_factor = 255 / ((zmax - zmin) || 1);
          let plotdata = new Uint8ClampedArray(1);          
          let texture_data = new Uint8Array(3*datasize);
          var p=0, pp=0;
          var c, i, q;
          for (let yi=0; yi<dim_y; yi++) {
            for (let xi=0; xi<dim_x; xi++) {
              q = yi + dim_y * xi;
              dataset[pp++] = corrected[q]; // dataset is aligned with image.
              plotdata[0] = (corrected[q] - zmin) * scale_factor;
              c = cmap_array[plotdata[0]];
              texture_data[p++] = c.r;
              texture_data[p++] = c.g;
              texture_data[p++] = c.b;
            }
          }
          var texture = new THREE.DataTexture( texture_data, values.pixel_num_x[0][0], values.pixel_num_y[0][0], THREE.RGBFormat );
          texture.needsUpdate = true;
          textures[ind] = texture;
          datasets[ind] = dataset;
          var image = new THREE.Mesh(
            new THREE.PlaneGeometry(size_x, size_y), // distance in cm
            //new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
            new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
          );
          //image.minFilter = THREE.LinearFilter;
          //image.magFilter = THREE.NearestFilter;
          image.minFilter = THREE.NearestFilter;
          image.overdraw = true;
          image.rotation.y = 0; //- ind * galleryPhi;
          
          let position_key = sname[1];
          if (position_key == 'T') {
            image.position.set(-x_offset,  size_y/2.0 + y_offset + vertical_offset + panel_gap/2, z);
          }
          else if (position_key == 'B') {
            image.position.set(-x_offset, -size_y/2.0 + y_offset + vertical_offset - panel_gap/2, z);
          }
          else if (position_key == 'L') {
            image.position.set(-size_x/2.0 + x_offset + lateral_offset - panel_gap/2, -y_offset, z);
          }
          else if (position_key == 'R') {
            image.position.set( size_x/2.0 + x_offset + lateral_offset + panel_gap/2, -y_offset, z);
          }

          images.push(image);
          if (images.length == numImages) { camera.updateProjectionMatrix(); render() }
          scene.add(image);
        })
      }
    });
      
    
    return true;
  }
  
  function rescale_all(scale_f, zmin_new, zmax_new) {
    var scale_f = (scale_f == null) ? function(x) { return x } : scale_f;
    var zmin_new = (zmin_new == null) ? zmin : zmin_new;
    var zmax_new = (zmax_new == null) ? zmax : zmax_new;
    var scaled_zmin = scale_f(zmin_new);
    var scaled_zmax = scale_f(zmax_new);
    var cmap_array = colormap_array(colormap.get_colormap('jet'));
    let scale_factor = 255 / ((scaled_zmax - scaled_zmin) || 1);
    for (var i in datasets) {
      let plotdata = new Uint8ClampedArray(1);
      let dataset = datasets[i];
      let texture = textures[i];
      var p=0, pp=0, c;
      var size = dataset.length;
      for (let pp=0; pp<size; pp++) {
        plotdata[0] = (scale_f(dataset[pp]) - scaled_zmin) * scale_factor;
        c = cmap_array[plotdata[0]];
        texture.image.data[p++] = c.r;
        texture.image.data[p++] = c.g;
        texture.image.data[p++] = c.b;
      }
      texture.needsUpdate = true;
    }
  }
  
  window.rescale_all = rescale_all;
  
  function flatten_data(data) {
    // assumes row-major array order
    var ydim = data.length;
    var xdim;
    var unrolled = [], p=0;
    for (let j=0; j<ydim; j++) {
      let row = data[j];
      xdim = row.length;
      for (let i=0; i<xdim; i++) {
        unrolled[p++] = row[i];
      }
    }
    return { data: unrolled, xdim: xdim, ydim: ydim }
  }
  
  function flatten_data_f(data) {
    // to column-major array order
    var xdim = data.length;
    var ydim;
    var unrolled = [], p=0;
    for (let i=0; i<xdim; i++) {
      let column = data[i];
      ydim = column.length;
      for (let j=0; j<ydim; j++) {
        let index = j * xdim + i;
        unrolled[index] = column[j];
      }
    }
    return { data: unrolled, xdim: xdim, ydim: ydim }
  }
  
  function colormap_array(colormap) {
    var _colormap_array = [];
    for (var i=0; i<256; i++) {
        _colormap_array[i] = d3.rgb(colormap(i));
        _colormap_array[i].a = 255;
    }
    _colormap_array[256] = d3.rgb(0,0,0);
    _colormap_array[256].a = 0;
    return _colormap_array;
  };

  render();
  function render() {
    //console.log(imagesLoaded, numImages, images.length);
    if( ! imagesLoaded && images.length === numImages){
      camera.updateProjectionMatrix();
      imagesLoaded = true;
      document.body.classList.add('imagesLoaded');
      rescale_all(Math.log, 0.5) 
    }
    renderer.render(scene, camera);
    requestAnimationFrame( render );
  }
  
  element.addEventListener(
    'dblclick',
    function(e){ 
      e.preventDefault();
      //restore_view();
      controls.reset();
    },
    false
  );
  
  element.addEventListener('wheel', function(e) {
    if (!locked_view) { return }
    e.preventDefault();
    if (e.shiftKey) {
      camera.position.z += e.deltaY/2;
    } else {
      camera.zoom *= (1 - e.deltaY/500);
      camera.updateProjectionMatrix();
    }
  });
  
  element.addEventListener(
    'mousedown', 
    function(e){
      if (!locked_view) { return }
      if(!mouseDown){
        mouseDown = e;
        origin = { 'angle_y' : camera.rotation.y, 'angle_x': camera.rotation.x, 'position' : camera.position };
        element.classList.add('mouseDown');
      }
    },
    false
  );
  element.addEventListener(
    'mouseup',
    function(e){ 
      if (!locked_view) { return }
      mouseDown = false;
      element.classList.remove('mouseDown');
    },
    false
  );
  element.addEventListener(
    'mousemove',
    function(e){
      if (!locked_view) { return }
      var newPos;
      if(mouseDown){
        camera.rotation.y = origin['angle_y'] + ( speedCoeff * Math.PI * ( e.clientX - mouseDown.clientX ) / window.innerWidth );
        camera.rotation.x = origin['angle_x'] + ( speedCoeff * Math.PI * ( e.clientY - mouseDown.clientY ) / window.innerHeight );
      }
    },
    false
  );
  
  document.getElementById("unlock_view").onclick = function() {
    locked_view = !this.checked;
    controls.enabled = this.checked;
  }
};
