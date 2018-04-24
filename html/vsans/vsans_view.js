"use strict"
window.onload = function(){
  zip.useWebWorkers = false;
  var numImages,
    galleryRadius,
    starCloud,
    origin,
    imagesLoaded = true,
    mouseDown = false,
    images = [],
    keyDown = [],
    starPaths=[],
    speedCoeff=0.5,
    yaxis = new THREE.Vector3(0,1,0),
    scene = new THREE.Scene().add( new THREE.AmbientLight(0xffffff) ),
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
  
  scene.add(camera);
  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  
  var controls = new THREE.OrbitControls( camera );
  controls.target.z = -1000;
  

  //controls.addEventListener( 'change', render );
  controls.update();
  window.camera = camera;
  window.controls = controls;
  loadImages();
  function loadImages(){
    if(!imagesLoaded) return(false);

    //Unload
    images.forEach(function(image){ scene.remove(image); });
    images = [];
    imagesLoaded = false;
    document.body.classList.remove('imagesLoaded');

    //Preload
    //numImages = 1 * ( document.getElementById('numImages').value || 12 );
    //galleryRadius = 1024 * numImages / Math.PI / 1.8;
    galleryRadius = 10000;
    //var galleryPhi = 2 * Math.PI / numImages;
    //if( camera.position.length() > galleryRadius ){ camera.position.set(0,0,0); }
    numImages = 8;
    camera.position.set(0,0,0);
    controls.update();
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
      console.log(entry);
      for(var i=0; i < short_detectors.length; i++){ loadDetector(i); }
      async function loadDetector(ind){
        var sname = short_detectors[i];
        var dname = "detector_" + sname;
        var cmap_array = colormap_array(colormap.get_colormap('jet'));
        entry.get("instrument/" + dname).then(async function(det) {
          // get all values:
          let values = {};
          for (let k of det.keys()) {
            let value = await det.get(k).then(function(field) { return (field == null) ? [[null]] : field.getValue() });
            values[k] = value;
          }
          console.log(values);
          //let d1 = await entry.get('DAS_logs/carriage1Trans/softPosition').then(function(field) { return field.getValue() });
          //let d2 = await entry.get('DAS_logs/carriage2Trans/softPosition').then(function(field) { return field.getValue() });
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
          let size_x = x_pixel_size * values.pixel_num_x[0][0];
          let size_y = y_pixel_size * values.pixel_num_y[0][0];
          let x_offset = x_pixel_size/2; // cm
          let y_offset = y_pixel_size/2; // cm
          let dim_x = parseInt(values.pixel_num_x[0][0]);
          let dim_y = parseInt(values.pixel_num_y[0][0]);
          let z = -(values.distance[0][0] + z_offset);
          let solid_angle_correction = Math.pow(z, 2) / 1e6;
          let flattened = flatten_data_f(values.data);
          let corrected = flattened.data.map(function(d) { return Math.log(d * solid_angle_correction) });  
          let datasize = flattened.data.length;
          let plotdata = new Uint8ClampedArray(datasize);
          let texture_data = new Uint8Array(3*datasize);
          var p=0;
          var c;
          for (var i=0; i<datasize; i++) {
            plotdata[i] = corrected[i]*40;
            c = cmap_array[plotdata[i]];
            texture_data[p++] = c.r;
            texture_data[p++] = c.g;
            texture_data[p++] = c.b;
          }
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
          if (images.length == numImages) { render() }
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

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  render();
  function render() {
    //console.log(imagesLoaded, numImages, images.length);
    if( ! imagesLoaded && images.length === numImages){
      images.forEach(function(image){ scene.add(image); });
      imagesLoaded = true;
      document.body.classList.add('imagesLoaded');      
    }

    controls.update();
    //keyNav();
    
    renderer.render(scene, camera);
    requestAnimationFrame( render );
  }
  
  /*
  // Nav
  document.addEventListener(
    'keydown',
    function(e){ 
      keyDown[e.key]=true;
      if( e.key === '-' ) camera.rotation.y += Math.PI;
    },
    false
  );
  document.addEventListener(
    'keyup',
    function(e){ keyDown[e.key]=false; },
    false
  );
  function keyNav(){
    var newPos = new THREE.Vector3(0,0,0);
    if( keyDown['ArrowLeft'] || keyDown['ArrowRight'] || keyDown['ArrowUp'] || keyDown['ArrowDown'] ){
      document.body.classList.add('keyDown');
      if( keyDown['ArrowUp'] || keyDown['ArrowDown'] ){
        newPos.add( camera.getWorldDirection().multiplyScalar( keyDown['ArrowUp'] ? 1 : -1 ) );
      }
      if( keyDown['ArrowLeft'] || keyDown['ArrowRight']){
        if( keyDown['Shift'] ){
          newPos.add( camera.getWorldDirection().applyAxisAngle( yaxis, (keyDown['ArrowLeft'] ? 1 : -1) * Math.PI / 2));
        } else {
          camera.rotation.y += (keyDown['ArrowLeft'] ? 1 : -1) * speedCoeff * Math.PI / 60;
        }
      }
      newPos
        .normalize()
        .multiplyScalar( speedCoeff * 7 * numImages )
        .add( camera.position );
      if( newPos.length() < 0.95 * galleryRadius ){
        camera.position.set( newPos.x, 0, newPos.z );
      }
    }
    else{
      document.body.classList.remove('keyDown')
    }
  } 
  document.addEventListener(
    'mousedown', 
    function(e){
      if(!mouseDown){
        mouseDown = e;
        origin = { 'angle' : camera.rotation.y, 'position' : camera.position };
        document.body.classList.add('mouseDown');
      }
    },
    false
  );
  document.addEventListener(
    'mouseup',
    function(e){ 
      mouseDown = false;
      document.body.classList.remove('mouseDown');
    },
    false
  );
  document.addEventListener(
    'mousemove',
    function(e){
      var newPos;
      if(mouseDown){
        newPos = camera.getWorldDirection()
          .multiplyScalar( e.clientY - mouseDown.clientY );
        if(keyDown['Shift']){
          newPos.add( camera.getWorldDirection()
            .applyAxisAngle( yaxis, - Math.PI / 2)
            .multiplyScalar( e.clientX - mouseDown.clientX ) 
          );
        } else {
          camera.rotation.y = origin['angle'] + ( 1.5 * speedCoeff * Math.PI * ( e.clientX - mouseDown.clientX ) / window.innerWidth );
        }
        newPos
          .multiplyScalar( speedCoeff * galleryRadius / window.innerWidth / 10 ) 
          .add( origin['position'] );    
        if( newPos.length() < 0.95 * galleryRadius ){
          camera.position.set( newPos.x, 0, newPos.z);
        }
      }
    },
    false
  );
  
  document.addEventListener('wheel', function(e) {
    e.preventDefault();
    console.log(e, camera.zoom);
    if (e.shiftKey) {
      camera.position.z += e.deltaY/2;
    } else {
      camera.zoom *= (1 - e.deltaY/200);
      camera.updateProjectionMatrix();
    }
  });

  //UI

  document.getElementById('loadImages').addEventListener(
    'click',
    function(){
      loadImages();
      this.blur();
    },
    false
  );

  
  window.addEventListener(
    'resize',
    function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }, 
    false
  );
  */
};
