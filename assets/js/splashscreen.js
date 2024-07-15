import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer, bloomPass, mixer, model, clickableBox;
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let modelEmissiveMaterial;

// Function to prevent default scrolling
function preventDefaultScroll(event) {
  event.preventDefault();
}

function preventDefaultKeys(event) {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End'];
  if (keys.includes(event.code)) {
    event.preventDefault();
  }
}



function preventScrolling() {
  // Prevent scrolling with the mouse wheel
  window.addEventListener('wheel', preventDefaultScroll, { passive: false });
  // Prevent scrolling with touch
  window.addEventListener('touchmove', preventDefaultScroll, { passive: false });
  // Prevent scrolling with keyboard
  window.addEventListener('keydown', preventDefaultKeys, { passive: false });
}

function allowScrolling() {
  document.documentElement.style.setProperty('--custom-scrollbar-shadow', 'inset 0 0 999px rgb(255, 255, 255)');
  // Allow scrolling with the mouse wheel
  window.removeEventListener('wheel', preventDefaultScroll, { passive: false });
  // Allow scrolling with touch
  window.removeEventListener('touchmove', preventDefaultScroll, { passive: false });
  // Allow scrolling with keyboard
  window.removeEventListener('keydown', preventDefaultKeys, { passive: false });
}
preventScrolling();


function fadeOutThreeJs() {
  const canvas = document.querySelector('#myCanvas');
  if (canvas) {
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.remove();
    }, 1450);
  } else {
    console.error("Canvas element not found");
  }
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.5, 50000);
  camera.position.set(0, 0, 90);
  const modelPosition = new THREE.Vector3(0, 1.05, -1);
  camera.lookAt(modelPosition);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight + 2);
  renderer.domElement.id = 'myCanvas';
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.left = '0px';
  renderer.domElement.style.zIndex = '9';
  document.body.appendChild(renderer.domElement);

  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
  spotLight.position.set(0, 25, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.3, 0.9, 0);
  composer.addPass(bloomPass);

  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  loader.load(
    'assets/threeJS/scene.gltf',
    (gltf) => {
      console.log('Model loaded successfully:', gltf);
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          const emissiveMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xff0000,
            emissiveIntensity: 3,
          });
          child.material = emissiveMaterial;
          modelEmissiveMaterial = emissiveMaterial;
        }
      });
      model.position.set(0, 1.05, -1);
      model.scale.set(1, 1, 1);
      scene.add(model);

      const animations = gltf.animations;
      if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(model);
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce);
          action.clampWhenFinished = true;
        });
        const action = mixer.clipAction(animations[0]);
        action.paused = true;
      }
    },
    (xhr) => {
      const progress = (xhr.loaded / xhr.total) * 100;
      console.log(`Loading progress: ${progress.toFixed(2)}%`);
    },
    (error) => {
      console.error('Error loading model:', error);
    }
  );

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('click', onClick);
  window.addEventListener('touchstart', onClick);
  window.addEventListener('mousemove', onMouseMove);

  animate();
}




const circleRadiusX = 0.2;  // Radius of the circle width
const circleRadiusY = 0.35;  // Radius of the circle height
function isInsideClickableBox(coords) {
  const circleCenter = { x: 0, y: 0 }; // Center of the screen

  // Calculate the distance from the point to the center of the circle
  const distanceFromCenter = Math.sqrt(
    Math.pow((coords.x - circleCenter.x) / circleRadiusX, 2) +
    Math.pow((coords.y - circleCenter.y) / circleRadiusY, 2)
  );

  // Check if the distance is within the circle's radius
  return distanceFromCenter <= 1;
}

// Make functions accessible globally
window.onWindowResize = onWindowResize;
window.onClick = onClick;
window.onMouseMove = onMouseMove;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
  let mouseCoords;
  if (event.type === 'click') {
    mouseCoords = { x: event.clientX, y: event.clientY };
  } else if (event.type === 'touchstart') {
    mouseCoords = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  const normalizedCoords = {
    x: (mouseCoords.x / window.innerWidth) * 2 - 1,
    y: -(mouseCoords.y / window.innerHeight) * 2 + 1
  };

  if (isInsideClickableBox(normalizedCoords)) {
    if (mixer) {
      const action = mixer._actions[0];
      if (action.paused) {
        action.paused = false;
        action.loop = THREE.LoopOnce;
        action.reset();
        action.play();
        targetEmissiveIntensity = 4.8;
        setTimeout(fadeOutThreeJs, 5400);
        setTimeout(allowScrolling, 6200);
      }
    }
  }


  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(model, true);

  if (intersects.length > 0) {
    if (mixer) {
      const action = mixer._actions[0];
      if (action.paused) {
        action.paused = false;
        action.loop = THREE.LoopOnce;
        action.reset();
        action.play();
        targetEmissiveIntensity = 4.8;
        setTimeout(fadeOutThreeJs, 5400);
        setTimeout(allowScrolling, 6400);
      }
    }
  }
}

let targetEmissiveIntensity = 4;
const transitionSpeed = 0.1; // Adjust this value to change the transition speed

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const normalizedCoords = {
    x: mouse.x,
    y: mouse.y
  };

  if (isInsideClickableBox(normalizedCoords)) {
    targetEmissiveIntensity = 4.8;
    renderer.domElement.style.cursor = "pointer";
  } else {
    targetEmissiveIntensity = 4;
    renderer.domElement.style.cursor = "auto";
  }
}


function animate() {
  requestAnimationFrame(animate);

  if (mixer) {
    mixer.update(clock.getDelta());
  }

  // Smoothly transition the emissive intensity
  if (modelEmissiveMaterial) {
    modelEmissiveMaterial.emissiveIntensity += (targetEmissiveIntensity - modelEmissiveMaterial.emissiveIntensity) * transitionSpeed;
  }

  // Render the scene through the composer for post-processing effects
  composer.render(clock.getDelta());

  if (mixer) {
    mixer.update(clock.getDelta());
  }

  composer.render(clock.getDelta());
}

document.addEventListener('DOMContentLoaded', init);
