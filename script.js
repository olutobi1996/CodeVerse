// Scroll Reveal
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

// Starfield Background
const starCanvas = document.getElementById('starfield');
if (starCanvas) {
  const ctx = starCanvas.getContext('2d');
  let stars = [];

  function resizeStarCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      radius: Math.random() * 1.5,
      velocity: Math.random() * 0.5 + 0.2,
    }));
  }

  function drawStars() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);
    ctx.fillStyle = '#00C7D9';
    stars.forEach(star => {
      star.y += star.velocity;
      if (star.y > starCanvas.height) star.y = 0;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resizeStarCanvas();
  drawStars();
  window.addEventListener('resize', resizeStarCanvas);
}

// Mars Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('mars-canvas'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 2, 5);
scene.add(directionalLight);

const loader = new THREE.TextureLoader();
const marsTexture = loader.load('textures/mars_texture.jpg');
const marsNormal = loader.load('textures/mars_normal.jpg');
const starfield = loader.load('textures/starfield.jpg');
scene.background = starfield;

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 64, 64),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: marsNormal,
  })
);
scene.add(mars);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

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

