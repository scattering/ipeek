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
  
  /*
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.target.set(0,0,-1);
  controls.enableZoom = false;
  controls.enablePan = false;
	controls.enableDamping = true;
	controls.rotateSpeed = - 0.03;
  controls.saveState();
  controls.enabled = false;
  */
  
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
    numImages = short_detectors.length;
    
    var myRequest = new Request('https://ncnr.nist.gov/ipeek/data/VSANS/live_data.nxz');
    var filename = "live_data";
    var f;
    fetch(myRequest).then(function(response) {
      return response.blob();
    }).then(function(blob) {
      return new Promise(function(resolve, reject) {
        zip.createReader(
          new zip.BlobReader(blob), function(reader) {
            // get all entries from the zip
            reader.getEntries(function(entries) {
              f = new nz.File().init(filename, entries);
              var entry;
              f.get(f.groupnames()[0])
                .then(function(en) { 
                  entry = en;
                  resolve(en);
                });
            });
          });
      })
    }).then(function(entry) {
      var fov = 0;
      for(var i=0; i < short_detectors.length; i++){ loadDetector(i); }
      async function loadDetector(ind){
        var sname = short_detectors[i];
        var dname = "detector_" + sname;
        var cmap_array = colormap_array(colormap.get_colormap('jet'));
        entry.get("instrument/" + dname).then(async function(det) {
          // get all values:
          let values = {};
          let attrs = {};
          for (let k of det.keys()) {
            let f = await det.get(k).then(function(field) { 
              if (field == null) {
                return [[[null]], null]
              } else {
                return Promise.all([field.getValue(), field.getAttrs()]);
              }
              //return (field == null) ? {[[null]] : field.getValue() });
            });
            //let value = await det.get(k).then(function(field) { return (field == null) ? [[null]] : field.getValue() });
            values[k] = f[0];
            attrs[k] = f[1];
          }
          //console.log(values);
          let z_offset = (values.setback || [[0]])[0][0];
          var x_pixel_size, y_pixel_size;
          let inline_pixel_size = 0.75;
          if (values.tube_orientation[0][0].toUpperCase() == "VERTICAL") {
            x_pixel_size = values.x_pixel_size[0][0] / 10; // mm to cm
            y_pixel_size = inline_pixel_size; // a made-up number
          } else {
            x_pixel_size = inline_pixel_size; // a made-up number
            y_pixel_size = values.y_pixel_size[0][0] / 10; // mm to cm
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
          let corrected = flattened.map(function(d) { return Math.log(d * solid_angle_correction) });  
          let datasize = flattened.length;
          //let plotdata = new Uint8ClampedArray(datasize);
          let plotdata = new Uint8ClampedArray(1);          
          let texture_data = new Uint8Array(3*datasize);
          var p=0;
          var c, i, q;
          for (let yi=0; yi<dim_y; yi++) {
            for (let xi=0; xi<dim_x; xi++) {
              q = yi + dim_y * xi;
              plotdata[0] = corrected[q] * 40;
              c = cmap_array[plotdata[0]];
              texture_data[p++] = c.r;
              texture_data[p++] = c.g;
              texture_data[p++] = c.b;
            }
          }
          
          /*
            for (var i=0; i<datasize; i++) {
            plotdata[i] = corrected[i]*40;
            c = cmap_array[plotdata[i]];
            texture_data[p++] = c.r;
            texture_data[p++] = c.g;
            texture_data[p++] = c.b;
          }
          */
          var texture = new THREE.DataTexture( texture_data, values.pixel_num_x[0][0], values.pixel_num_y[0][0], THREE.RGBFormat );
          texture.needsUpdate = true;
          var image = new THREE.Mesh(
            new THREE.PlaneGeometry(size_x, size_y), // distance in cm
            //new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
            new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
          );
          image.minFilter = THREE.LinearFilter;
          //image.magFilter = THREE.NearestFilter;
          //image.minFilter = THREE.NearestFilter;
          image.overdraw = true;
          image.rotation.y = 0; //- ind * galleryPhi;
          //let z = -(((sname[0] == 'F') ? d1[0][0] : d2[0][0]) + z_offset);
          //console.log(z);
          
          let position_key = sname[1];
          if (position_key == 'T') {
            image.position.set(-x_offset, size_y/2.0 + y_offset + values.vertical_offset[0][0] + values.panel_gap[0][0]/10/2, z);
          }
          else if (position_key == 'B') {
            image.position.set(-x_offset, -size_y/2.0 + y_offset + values.vertical_offset[0][0] - values.panel_gap[0][0]/10/2, z);
          }
          else if (position_key == 'L') {
            image.position.set(-size_x/2.0 + x_offset + values.lateral_offset[0][0] - values.panel_gap[0][0]/10/2, -y_offset, z);
            //image.position.set(-size_x/10/2, 0, z);
          }
          else if (position_key == 'R') {
            image.position.set(size_x/2.0 + x_offset + values.lateral_offset[0][0] + values.panel_gap[0][0]/10/2, -y_offset, z);
            //image.position.set(size_x/10/2, 0, z);
          }
          //image.position.set( galleryRadius * Math.sin( ind * galleryPhi ), 0, - galleryRadius * Math.cos( ind * galleryPhi ) );
          //image.position.set( 0, 0, -values.distance[0][0])
          images.push(image);
          if (images.length == numImages) { camera.updateProjectionMatrix(); render() }
          scene.add(image);
          //console.log(values.distance[0][0],flattened, texture);
        })
      }
    });
      
    
    return true;
  }
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
    }
    renderer.render(scene, camera);
    requestAnimationFrame( render );
  }
  
  element.addEventListener(
    'dblclick',
    function(e){ 
      //controls.reset();
      restore_view();
    },
    false
  );
  
  element.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (e.shiftKey) {
      camera.position.z += e.deltaY/2;
    } else {
      camera.zoom *= (1 - e.deltaY/200);
      camera.updateProjectionMatrix();
    }
  });
  
  element.addEventListener(
    'mousedown', 
    function(e){
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
      mouseDown = false;
      element.classList.remove('mouseDown');
    },
    false
  );
  element.addEventListener(
    'mousemove',
    function(e){
      var newPos;
      if(mouseDown){
        camera.rotation.y = origin['angle_y'] + ( speedCoeff * Math.PI * ( e.clientX - mouseDown.clientX ) / window.innerWidth );
        camera.rotation.x = origin['angle_x'] + ( speedCoeff * Math.PI * ( e.clientY - mouseDown.clientY ) / window.innerHeight );
      }
    },
    false
  );
  
};
