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

// === ✨ TEXT ON MARS START ===
const textCanvas = document.createElement('canvas');
textCanvas.width = 256;
textCanvas.height = 64;
const ctx = textCanvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.font = 'bold 28px Orbitron';
ctx.textAlign = 'center';
ctx.fillText('CodeVerse', textCanvas.width / 2, 45);

const textTexture = new THREE.CanvasTexture(textCanvas);
textTexture.needsUpdate = true;

const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
const textGeometry = new THREE.PlaneGeometry(1.8, 0.45); // Adjust size if needed
const textPlane = new THREE.Mesh(textGeometry, textMaterial);

// Position slightly above Mars surface
textPlane.position.set(0, 1.5, 0);
textPlane.rotation.x = -0.2;

// Attach the text to Mars so it spins with it
mars.add(textPlane);
// === ✨ TEXT ON MARS END ===

// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

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


