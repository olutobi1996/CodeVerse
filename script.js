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

// === EARTH GLOBE ===
const earthTexture = loader.load('https://ksenia-k.com/img/earth-map-colored.png');

const globeGeometry = new THREE.IcosahedronGeometry(1.5, 22);

const globeMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertex-shader-map').textContent,
  fragmentShader: document.getElementById('fragment-shader-map').textContent,
  uniforms: {
    u_map_tex: { value: earthTexture },
    u_dot_size: { value: 6.0 } // 👈 bigger so you SEE it
  },
  transparent: true,
  depthWrite: false
});

const globe = new THREE.Points(globeGeometry, globeMaterial);
scene.add(globe);

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
  globe.rotation.y += 0.002;
}
animate();

// === HANDLE RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});









