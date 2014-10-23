// GLOBALS 
var container, scene, camera, renderer, controls, stats;
// custom global variables
var video, videoImage, videoImageContext, videoTexture;

var videoInput = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');

init();
animate();

// FUNCTIONS    
function init() {

  // SCENE
  scene = new THREE.Scene();

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  
  // RENDERER
  renderer = new THREE.CanvasRenderer(); 
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  
  // FACE DETECTION SETUP
  var offset = SCREEN_HEIGHT > 950 ? -6.5 : 0;
  var htracker = new headtrackr.Tracker({cameraOffset : offset});
  htracker.init(videoInput, canvasInput);

  // EVENTS
  
  // VIDEO
  video = document.getElementById( 'viewVideo' );
  video.load(); // must call after setting/changing source
   
  videoImage = document.createElement( 'canvas' );
  videoImage.width = 1200;
  videoImage.height = 674;

  videoImageContext = videoImage.getContext( '2d' );
  videoImageContext.fillStyle = '#ffffff';
  videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

  videoTexture = new THREE.Texture( videoImage );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  
  var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
  var movieGeometry = new THREE.PlaneGeometry( videoImage.width, videoImage.height, 4, 4 );
  var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  movieScreen.position.set(0,-80,0);
  scene.add(movieScreen);

  // BACKGROUND IMAGE
  var bgMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('img/cover.jpg')
  });
            
  var bg = new THREE.Mesh(new THREE.CubeGeometry( SCREEN_WIDTH + 700, SCREEN_HEIGHT + 700, 1), bgMaterial);
  bg.position.set(0,0,-600);
  scene.add(bg);

  // FOG
  scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

  // SETUP CAMERA CONTROLLER
  if( SCREEN_WIDTH > 1600 )
    headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 5, [0,-20,1100], movieScreen.position, { damping : 0.9 });
  else
    headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 6, [0,-20,750], movieScreen.position, { damping : 0.9 });

  // EVENT: headtrackr status
  document.addEventListener('headtrackrStatus', 
    function (event) {
      // FACE FOUND: PLAY VIDEO
      if (event.status == "found") {
        setTimeout( function() {
          video.play();
        }, 1000);
      }

      // CAMERA FOUND: HIDE ALLOW NOTICE
      if (event.status == "camera found") 
        document.getElementById('allow').style.opacity = '0'; 

      // NO CAMERA: HIDE ALLOW NOTICE, PLAY VIDEO
      if (event.status == "no camera") {
        document.getElementById('allow').style.opacity = '0'; 
        video.play();
      }
  });  

  // START HEADTRCKR
  htracker.start();
}

function animate() {
  requestAnimationFrame( animate );
  render();   
  update();
}

function update() {
}

function render() { 
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    videoImageContext.drawImage( video, 0, 0 );
    if ( videoTexture ) 
      videoTexture.needsUpdate = true;
  }

  renderer.render( scene, camera );
}

// HOVER ARROW: SNEAK PEEK CONTENT
var content = document.getElementById('content');
content.onmouseover = function () {
  content.style.top = '85vh';
}

content.onmouseleave = function () {
  content.style.top = '100vh';
}
