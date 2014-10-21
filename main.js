// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
// custom global variables
var video, videoImage, videoImageContext, videoTexture;

var videoInput = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');

init();
animate();

// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,0,400);
  camera.lookAt(scene.position);  
  // RENDERER
  renderer = new THREE.CanvasRenderer(); 
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  // CONTROLS
  //controls = new THREE.OrbitControls( camera, renderer.domElement );

  // set up camera controller
  headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 20, [0,-90,350], new THREE.Vector3(0,0,0), {
  damping : 4
});
  
  // Face detection setup
  var htracker = new headtrackr.Tracker({cameraOffset : -6.5});
  htracker.init(videoInput, canvasInput);
  htracker.start();
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  
  
  ///////////
  // VIDEO //
  ///////////
  
  // create the video element
  //video = document.createElement( 'video' );
  // video.id = 'video';
  // video.type = ' video/ogg; codecs="theora, vorbis" ';
  //video.src = "videos/video.mp4";
  video = document.getElementById( 'viewVideo' );
  video.load(); // must call after setting/changing source
  
  // alternative method -- 
  // create DIV in HTML:
  // <video id="myVideo" autoplay style="display:none">
  //    <source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
  // </video>
  // and set JS variable:
  // video = document.getElementById( 'myVideo' );
  
  videoImage = document.createElement( 'canvas' );
  videoImage.width = 1200;
  videoImage.height = 674;

  videoImageContext = videoImage.getContext( '2d' );
  // background color if no video present
  videoImageContext.fillStyle = '#000000';
  videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

  videoTexture = new THREE.Texture( videoImage );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  
  var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
  // the geometry on which the movie will be displayed;
  //    movie image will be scaled to fit these dimensions.
  var movieGeometry = new THREE.PlaneGeometry( videoImage.width, videoImage.height, 4, 4 );
  var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  movieScreen.position.set(0,-80,0);
  movieScreen.rotation.z += 3.14159265;
  scene.add(movieScreen);

  // create a set of coordinate axes to help orient user
  //  //    specify length in pixels in each direction
  var axes = new THREE.AxisHelper(200);
  scene.add( axes );
  
  camera.position.set(0,0,900);
  camera.lookAt(movieScreen.position);

  document.addEventListener('headtrackrStatus', 
    function (event) {
      console.log(event.status);
      if (event.status == "found") {
        setTimeout( function() {
          video.play();
        }, 1000);
      }
    }
  );  
}

function animate() 
{
    requestAnimationFrame( animate );
  render();   
  update();
}

function update()
{
  if ( keyboard.pressed("p") )
    video.play();
    
  if ( keyboard.pressed("space") )
    video.pause();

  if ( keyboard.pressed("s") ) // stop video
  {
    video.pause();
    video.currentTime = 0;
  }
  
  if ( keyboard.pressed("r") ) // rewind video
    video.currentTime = 0;
  
}

function render() 
{ 
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
  {
    videoImageContext.drawImage( video, 0, 0 );
    if ( videoTexture ) 
      videoTexture.needsUpdate = true;
  }

  renderer.render( scene, camera );
}
