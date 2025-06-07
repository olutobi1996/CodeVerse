import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scroll Reveal Animation
window.addEventListener('scroll', () => {
  document.querySelectorAll('.reveal').forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 150) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
});

// MARS CANVAS
const marsCanvas = document.getElementById('mars-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({
  canvas: marsCanvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 0.2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 2, 5);
scene.add(directionalLight);

// TEXTURES
const loader = new THREE.TextureLoader();
const marsTexture = loader.load('./textures/mars_texture.jpg');
const marsNormal = loader.load('./textures/mars_normal.jpg');
const starfield = loader.load('./textures/starfield.jpg');
scene.background = starfield;

// MARS SPHERE
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 64, 64),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: marsNormal,
  })
);
scene.add(mars);

// === ✨ CURVED TEXT WRAPPED AROUND MARS START ===

// Text to display
const displayText = ' CodeVerse To Welcome ';

// Settings for curved text
const charCount = displayText.length;
const radius = 1.22;  // Slightly above Mars radius (1.2)
const charWidth = 0.15;
const charHeight = 0.3;

// Group to hold all character planes
const textGroup = new THREE.Group();

// Helper to create texture for each character
function createCharTexture(char) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Optional shadow for readability
  context.shadowColor = 'black';
  context.shadowBlur = 8;

  context.font = 'bold 160px Orbitron, sans-serif';
  context.fillText(char, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
}

// Create a mesh for each character and position it on the sphere
for (let i = 0; i < charCount; i++) {
  const char = displayText[i];
  if (char === ' ') continue; // Skip spaces for cleaner spacing

  const charTexture = createCharTexture(char);

  const charMaterial = new THREE.MeshBasicMaterial({ map: charTexture, transparent: true });
  const charGeometry = new THREE.PlaneGeometry(charWidth, charHeight);
  const charMesh = new THREE.Mesh(charGeometry, charMaterial);

  // Angle for character placement around sphere's equator
  const angle = (i / charCount) * Math.PI * 2;

  // Position on circle around Y-axis (equator)
  charMesh.position.x = radius * Math.sin(angle);
  charMesh.position.y = 0;
  charMesh.position.z = radius * Math.cos(angle);

  // Rotate the plane to face outward from center
  charMesh.lookAt(new THREE.Vector3(0, 0, 0));
  charMesh.rotateY(Math.PI); // Flip so text faces outward

  textGroup.add(charMesh);
}

// Slightly lift the textGroup if needed (e.g., near equator at y=0)
textGroup.position.y = 0;

// Attach text group to Mars, so it rotates with the planet
mars.add(textGroup);

// === ✨ CURVED TEXT WRAPPED AROUND MARS END ===


// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5.0;  


// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



