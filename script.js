import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js';

// === SCROLL ANIMATION ===
gsap.utils.toArray(".reveal").forEach(section => {
  gsap.fromTo(section, {
    y: 50,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

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

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, {
  threshold: 0.1
});
reveals.forEach(reveal => observer.observe(reveal));

// === THREE.JS MARS SCENE ===
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
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
  normalMap: marsNormal,
  transparent: true,
});
const mars = new THREE.Mesh(new THREE.SphereGeometry(1.2, 64, 64), marsMaterial);
scene.add(mars);

// CURVED TEXT
const displayText = ' CodeVerse To Welcome ';
const charCount = displayText.length;
const radius = 1.22;
const charWidth = 0.15;
const charHeight = 0.3;
const textGroup = new THREE.Group();

function createCharTexture(char) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = 'black';
  context.shadowBlur = 8;
  context.font = 'bold 160px Orbitron, sans-serif';
  context.fillText(char, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

for (let i = 0; i < charCount; i++) {
  const char = displayText[i];
  if (char === ' ') continue;
  const charTexture = createCharTexture(char);
  const charMaterial = new THREE.MeshBasicMaterial({ map: charTexture, transparent: true });
  const charGeometry = new THREE.PlaneGeometry(charWidth, charHeight);
  const charMesh = new THREE.Mesh(charGeometry, charMaterial);
  const angle = (i / charCount) * Math.PI * 2;
  charMesh.position.x = radius * Math.sin(angle);
  charMesh.position.y = 0;
  charMesh.position.z = radius * Math.cos(angle);
  charMesh.lookAt(new THREE.Vector3(0, 0, 0));
  charMesh.rotateY(Math.PI);
  textGroup.add(charMesh);
}
textGroup.position.y = 0;
mars.add(textGroup);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5.0;

// RENDER LOOP
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// FADE MARS ON SCROLL
const fadeDuration = 600;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY <= 0) {
    mars.visible = true;
    controls.autoRotate = true;
    mars.material.opacity = 1;
  } else if (scrollY > 0 && scrollY < fadeDuration) {
    mars.visible = true;
    controls.autoRotate = true;
    mars.material.opacity = 1 - scrollY / fadeDuration;
  } else {
    mars.visible = false;
    controls.autoRotate = false;
  }
});

// === ✨ PARTICLE STARS BACKGROUND AROUND ORBIT ===
const orbitCanvas = document.getElementById("orbitParticles");
const ctx = orbitCanvas.getContext("2d");
orbitCanvas.width = window.innerWidth;
orbitCanvas.height = window.innerHeight;

let stars = Array.from({ length: 150 }).map(() => ({
  x: Math.random() * orbitCanvas.width,
  y: Math.random() * orbitCanvas.height,
  r: Math.random() * 2,
  d: Math.random() * 1.5 + 0.5
}));

function drawStars() {
  ctx.clearRect(0, 0, orbitCanvas.width, orbitCanvas.height);
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fill();
  });
  moveStars();
}

function moveStars() {
  stars.forEach(s => {
    s.y += s.d;
    if (s.y > orbitCanvas.height) {
      s.y = 0;
      s.x = Math.random() * orbitCanvas.width;
    }
  });
  requestAnimationFrame(drawStars);
}
drawStars();

window.addEventListener("resize", () => {
  orbitCanvas.width = window.innerWidth;
  orbitCanvas.height = window.innerHeight;
});

// === 🎧 AUDIO TOGGLE ===
const audio = document.getElementById("space-audio");
const button = document.getElementById("audio-toggle");

if (audio && button) {
  button.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      button.textContent = "🔇 Pause Space Ambience";
    } else {
      audio.pause();
      button.textContent = "🔊 Play Space Ambience";
    }
  });
}







