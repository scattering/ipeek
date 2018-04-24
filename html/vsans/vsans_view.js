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
    loadingBar = document.getElementById('loadingBar'),
    speedCoeff = document.getElementById('speedCoeff').value || 0.5,
    yaxis = new THREE.Vector3(0,1,0),
    loader =  new THREE.TextureLoader().setCrossOrigin('anonymous'),
    scene = new THREE.Scene().add( new THREE.AmbientLight(0xffffff) ),
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 ),
    renderer = new THREE.WebGLRenderer();

  loadImages();
  function loadImages(){
    if(!imagesLoaded) return(false);

    //Unload
    images.forEach(function(image){ scene.remove(image); });
    images = [];
    imagesLoaded = false;
    loadingBar.style.width = 0 + '%';
    document.body.classList.remove('imagesLoaded');

    //Preload
    //numImages = 1 * ( document.getElementById('numImages').value || 12 );
    //galleryRadius = 1024 * numImages / Math.PI / 1.8;
    //var galleryPhi = 2 * Math.PI / numImages;
    //if( camera.position.length() > galleryRadius ){ camera.position.set(0,0,0); }
    numImages = 8;
    camera.position.set(0,0,0);
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
          let d1 = await entry.get('DAS_logs/carriage1Trans/softPosition').then(function(field) { return field.getValue() });
          let d2 = await entry.get('DAS_logs/carriage2Trans/softPosition').then(function(field) { return field.getValue() });
          let z_offset = (values.setback || [[0]])[0][0];
          let size_x = values.x_pixel_size[0][0] * values.pixel_num_x[0][0]; // mm
          let size_y = values.y_pixel_size[0][0] * values.pixel_num_y[0][0]; // mm
          let dim_x = parseInt(values.pixel_num_x[0][0]);
          let dim_y = parseInt(values.pixel_num_y[0][0]);
          let flattened = flatten_data_f(values.data);
          let datasize = flattened.data.length;
          let plotdata = new Uint8ClampedArray(datasize);
          let texture_data = new Uint8Array(3*datasize);
          var p=0;
          var c;
          for (var i=0; i<datasize; i++) {
            plotdata[i] = flattened.data[i]*1;
            c = cmap_array[plotdata[i]];
            texture_data[p++] = c.r;
            texture_data[p++] = c.g;
            texture_data[p++] = c.b;
          }
          var texture = new THREE.DataTexture( texture_data, values.pixel_num_x[0][0], values.pixel_num_y[0][0], THREE.RGBFormat );
          texture.needsUpdate = true;
          var image = new THREE.Mesh(
            new THREE.PlaneGeometry(size_x/10, size_y/10), // distance in cm
            //new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
            new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
          );
          image.minFilter = THREE.LinearFilter;
          //image.magFilter = THREE.NearestFilter;
          //image.minFilter = THREE.NearestFilter;
          image.overdraw = true;
          image.rotation.y = 0; //- ind * galleryPhi;
          let z = -(((sname[0] == 'F') ? d1[0][0] : d2[0][0]) + z_offset);
          console.log(z);
          //let z = -values.distance[0][0];
          let position_key = sname[1];
          if (position_key == 'T') {
            image.position.set(0, size_y/10/2.0 + values.vertical_offset[0][0] + values.panel_gap[0][0]/2, z);
          }
          else if (position_key == 'B') {
            image.position.set(0, -size_y/10/2.0 + values.vertical_offset[0][0] - values.panel_gap[0][0]/2, z);
          }
          else if (position_key == 'L') {
            image.position.set(-size_x/10/2.0 + values.lateral_offset[0][0] + values.panel_gap[0][0]/2, z);
          }
          else if (position_key == 'R') {
            image.position.set(size_x/10/2.0 + values.lateral_offset[0][0] - values.panel_gap[0][0]/2, z);
          }
          //image.position.set( galleryRadius * Math.sin( ind * galleryPhi ), 0, - galleryRadius * Math.cos( ind * galleryPhi ) );
          //image.position.set( 0, 0, -values.distance[0][0])
          images.push(image);
          console.log(values.distance[0][0],flattened, texture);
        })
      }
    });
      
    //for(var i=0; i < numImages; i++){ loadImage(i); }
    function loadImage(ind){
      loader.load(
        'https://unsplash.it/1024/512/?random&nocache' + ind + Date.now(),
        function ( texture ) {
          var image = new THREE.Mesh(
            new THREE.PlaneGeometry(1024, 512), 
            new THREE.MeshBasicMaterial({ map: texture })
          );
          //image.minFilter = THREE.LinearFilter;
          image.magFilter = THREE.NearestFilter;
          image.minFilter = THREE.NearestFilter;
          image.overdraw = true;
          image.rotation.y = 0; //- ind * galleryPhi;
          //image.position.set( galleryRadius * Math.sin( ind * galleryPhi ), 0, - galleryRadius * Math.cos( ind * galleryPhi ) );
          image.position.set( 0, 0, 1000)
          images.push(image);
          loadingBar.style.width = Math.round( 100 * images.length / numImages ) + '%';
        },
        function ( xhr ) {
          console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        function ( xhr ) {
          console.log( 'An error happened' );
          loadImage(ind);
        }
      );
    }
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

  loadStars();
  function loadStars(){
    var starSpace = new THREE.Geometry();
    for(var i=0; i<1000; i++){
      starSpace.vertices.push( new THREE.Vector3( 0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random() ).normalize().multiplyScalar(4000 + (2000 * Math.random())));
      starSpace.colors.push(new THREE.Color( Math.random(), Math.random(), Math.random()));
      starPaths.push( { 'axis': new THREE.Vector3(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random() ), 'speed' : 0.0015 * Math.random() } );
    }
    starCloud = new THREE.Points(
      starSpace,
      new THREE.PointsMaterial({ size: 12,vertexColors: THREE.VertexColors})
    );
    scene.add(starCloud);
  }
  function moveStars(){
    starCloud.geometry.vertices.forEach(function(vertex,i){
      vertex.applyAxisAngle( starPaths[i]['axis'], starPaths[i]['speed'] );
    });
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  render();
  function render() {
    console.log(imagesLoaded, numImages, images.length);
    if( ! imagesLoaded && images.length === numImages){
      images.forEach(function(image){ scene.add(image); });
      imagesLoaded = true;
      document.body.classList.add('imagesLoaded');      
    }

    keyNav();

    moveStars();
    starCloud.geometry.verticesNeedUpdate = true;
    
    renderer.render(scene, camera);
    requestAnimationFrame( render );
  }

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

  //UI
  document.getElementById('close').addEventListener(
    'click',
    function(){ this.parentNode.style.display = 'none'; },
    false
  );
  document.getElementById('minMax').addEventListener(
    'click',
    function(){
      this.parentNode.classList.toggle('hidden');
      this.blur();
    },
    false
  );
  document.getElementById('speedCoeff').addEventListener(
    'change',
    function(){ 
      speedCoeff = this.value;
      document.getElementById('speedCoeffLabel').innerHTML = 'Speed: ' + Math.round( this.value * 100 ) + '%';
      this.blur();
    },
    false
  );  
  document.getElementById('numImages').addEventListener(
    'change',
    function(){
      if( loadImages() ){
        document.getElementById('numImagesLabel').innerHTML = 'Images: ' + this.value;
      }
      else{ this.value = numImages; }
      this.blur();
    },
    false
  );  
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
};
