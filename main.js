import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer, bloomPass, mixer, model;
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const boxSize = 1;


function preventDefaultScroll(event) {
  event.preventDefault();
  thumb.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function preventDefaultKeys(event) {
  // List of keys that cause scrolling
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End'];
  
  if (keys.includes(event.code)) {
    event.preventDefault();
  }
}


function preventScrolling() {
  // Prevent scrolling with the mouse wheel
  window.addEventListener('wheel', preventDefaultScroll, { passive: false });

  // Prevent scrolling with touch gestures
  window.addEventListener('touchmove', preventDefaultScroll, { passive: false });

  // Prevent scrolling with keyboard (arrow keys, spacebar, page up/down, home, end)
  window.addEventListener('keydown', preventDefaultKeys, { passive: false });
}

function allowScrolling() {
  document.documentElement.style.setProperty('--custom-scrollbar-shadow', 'inset 0 0 999px rgb(255, 255, 255)');
  // Allow scrolling with the mouse wheel
  window.removeEventListener('wheel', preventDefaultScroll, { passive: false });

  // Allow scrolling with touch gestures
  window.removeEventListener('touchmove', preventDefaultScroll, { passive: false });

  // Allow scrolling with keyboard
  window.removeEventListener('keydown', preventDefaultKeys, { passive: false });
}

// Call preventScrolling to initialize
preventScrolling();



function fadeOutThreeJs() {
  const canvas = document.querySelector('#myCanvas');
  if (canvas) {
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.remove(); // Remove the canvas element from the DOM
    }, 1450); // Adjust the delay as needed to match your transition duration
  } else {
    console.error("Canvas element not found");
  }
}


function init() {
  scene = new THREE.Scene();

  const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xf00000, transparent: true, opacity: 0 });
  const clickableBox = new THREE.Mesh(boxGeometry, boxMaterial);
  clickableBox.position.set(0, 0, 0); // Center of the screen
  scene.add(clickableBox);

  // Adjust camera position and lookAt
  camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.5, 50000);
  camera.position.set(0, 0, 90);

  const modelPosition = new THREE.Vector3(0, 1.05, -1);
  camera.lookAt(modelPosition);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight+2);
  renderer.domElement.id = 'myCanvas'; // Set the ID of the canvas
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.left = '0px';
  renderer.domElement.style.zIndex = '99999';
  document.body.appendChild(renderer.domElement);
  // Setup post-processing composer
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Lighting
  const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
  spotLight.position.set(0, 25, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);

    // Add bloom pass
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.3, 0.9, 0);
    composer.addPass(bloomPass);

  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  // Load the GLTF model
  const loader = new GLTFLoader();
  loader.load(
    'public/millennium_falcon/scene.gltf',
    (gltf) => {
      console.log('Model loaded successfully:', gltf);
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          // Apply emissive material to make it glow
          const emissiveMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xff0000,
            emissiveIntensity: 5 // Adjust this value to change brightness
          });
          child.material = emissiveMaterial;
        }
      });
      model.position.set(0, 1.05, -1);
      model.scale.set(1, 1, 1);
      scene.add(model);

      // Assuming the model has animations, get the animations
      const animations = gltf.animations;
      if (animations && animations.length) {
        // Create a mixer for the model
        mixer = new THREE.AnimationMixer(model);

        // Add all animations to the mixer
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce); // Set loop mode to LoopOnce
          action.clampWhenFinished = true; // Clamp when finished
        });

        // Play the default animation (if needed)
        const action = mixer.clipAction(animations[0]);
        action.paused = true; // Start paused
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

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  // Add click event listener
  window.addEventListener('click', onClick);
  window.addEventListener('touchstart', onClick);
  // Start animation loop
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {

  // Determine event coordinates based on event type
  let mouseCoords;
  if (event.type === 'click') {
    mouseCoords = { x: event.clientX, y: event.clientY };
  } else if (event.type === 'touchstart') {
    mouseCoords = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  // Calculate normalized device coordinates (-1 to +1)
  const normalizedCoords = {
    x: (mouseCoords.x / window.innerWidth) * 2 - 1,
    y: -(mouseCoords.y / window.innerHeight) * 2 + 1
  };

  // Check if the click/touch intersects with the clickable box
  if (isInsideClickableBox(normalizedCoords)) {
    // Trigger animation
    if (mixer) {
      const action = mixer._actions[0]; // Assuming you want to control the first animation clip
      if (action.paused) {
        action.paused = false;
        action.loop = THREE.LoopOnce; // Ensure it only loops once
        action.reset();
        action.play();
        setTimeout(fadeOutThreeJs, 5400);
        setTimeout(allowScrolling, 6200);
        

      }
    }
  }

  function isInsideClickableBox(coords) {
    // Define the boundaries of the clickable box
    const boxHalfSize = boxSize / 2;
    const boxCenter = new THREE.Vector2(0, 0); // Center of the screen

    // Check if the coordinates are inside the box boundaries
    return (
      coords.x >= boxCenter.x - boxHalfSize &&
      coords.x <= boxCenter.x + boxHalfSize &&
      coords.y >= boxCenter.y - boxHalfSize &&
      coords.y <= boxCenter.y + boxHalfSize
    );
  }

  // Raycasting to find intersected objects
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(model, true);

  if (intersects.length > 0) {
    // If the model is clicked, start the animation
    if (mixer) {
      const action = mixer._actions[0]; // Assuming you want to control the first animation clip
      if (action.paused) {
        action.paused = false; // Unpause the action

        action.loop = THREE.LoopOnce; // Ensure it only loops once
        action.reset();
        action.play();
        setTimeout(fadeOutThreeJs, 5400);
        setTimeout(allowScrolling, 6400);
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Update any animations or controls here
  if (mixer) {
    mixer.update(clock.getDelta());
  }

  // Render the scene through the composer for post-processing effects
  composer.render(clock.getDelta());
}

// Ensure the DOM is fully loaded before initializing the scene
document.addEventListener('DOMContentLoaded', init);