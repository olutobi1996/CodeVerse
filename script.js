import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js';

// === SCENE SETUP ===
const venusCanvas = document.getElementById('mars-canvas'); // keep ID for now
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({
  canvas: venusCanvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === LIGHTING ===
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 2, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffccaa, 1.2, 10);
pointLight.position.set(-2, 1, 3);
scene.add(pointLight);

// === TEXTURES ===
const loader = new THREE.TextureLoader();
const venusTexture = loader.load('./textures/8k_venus_surface.jpg');
const starfield = loader.load('./textures/starfield.jpg');
scene.background = starfield;

// === VENUS PLANET ===
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
  roughness: 1,
  metalness: 0.1,
  emissive: new THREE.Color(0x111111),
  emissiveIntensity: 0.25
});

const venus = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 128, 128),
  venusMaterial
);

// === GROUP FOR PLANET & LABELS ===
const planetGroup = new THREE.Group();
planetGroup.add(venus);
scene.add(planetGroup);

// === ORBITING TEXT: "Welcome to CodeVerse" ===
const orbitText = 'Welcome to CodeVerse';
const charCount = orbitText.length;
const orbitRadius = 1.22;
const charWidth = 0.16;
const charHeight = 0.32;
const orbitGroup = new THREE.Group();

function createStyledCharTexture(char) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 10;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 160px Orbitron, sans-serif';
  ctx.fillText(char, canvas.width / 2, canvas.height / 2);

  return new THREE.CanvasTexture(canvas);
}

for (let i = 0; i < charCount; i++) {
  const char = orbitText[i];
  if (char === ' ') continue;

  const texture = createStyledCharTexture(char);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(charWidth, charHeight), material);

  const angle = (i / charCount) * Math.PI * 2;
  mesh.position.set(
    orbitRadius * Math.sin(angle),
    0,
    orbitRadius * Math.cos(angle)
  );
  mesh.lookAt(0, 0, 0);
  mesh.rotateY(Math.PI);
  orbitGroup.add(mesh);
}

orbitGroup.position.y = 0;
venus.add(orbitGroup);

// === VENUS EXPRESS BANNER ===
const bannerCanvas = document.createElement('canvas');
bannerCanvas.width = 1024;
bannerCanvas.height = 512;
const bannerCtx = bannerCanvas.getContext('2d');

bannerCtx.fillStyle = 'rgba(0,0,0,0)';
bannerCtx.fillRect(0, 0, bannerCanvas.width, bannerCanvas.height);

bannerCtx.fillStyle = 'white';
bannerCtx.shadowColor = 'black';
bannerCtx.shadowBlur = 10;
bannerCtx.font = 'bold 70px Orbitron, sans-serif';
bannerCtx.textAlign = 'center';
bannerCtx.textBaseline = 'middle';
bannerCtx.fillText('Venus Express', bannerCanvas.width / 2, bannerCanvas.height / 2);

const textTexture = new THREE.CanvasTexture(bannerCanvas);
textTexture.minFilter = THREE.LinearFilter;
textTexture.magFilter = THREE.LinearFilter;
textTexture.anisotropy = 16;

const textMaterial = new THREE.MeshBasicMaterial({
  map: textTexture,
  transparent: true,
  depthWrite: false
});

const textPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 1.5),
  textMaterial
);
textPlane.position.set(0, 1.8, 3);
scene.add(textPlane); // or planetGroup.add(textPlane) if you want it to follow planet

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 3.0;

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// === HANDLE RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});








