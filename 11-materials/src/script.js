import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Textures
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg');
const doorAmbientOcclussionTexture = textureLoader.load(
  'textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/4.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizesx
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Mesh
// material.map = doorColorTexture;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.flatShading = true;
// material.matcap = matcapTexture;
const material = new THREE.MeshStandardMaterial();

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  material
);
const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

scene.add(sphereMesh, planeMesh, torusMesh);

sphereMesh.position.x = -1.5;
torusMesh.position.x = 1.5;

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 4;

camera.position.x = 5;
camera.lookAt(new THREE.Vector3(10, 3, 10));

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphereMesh.rotation.y = 0.1 * elapsedTime;
  planeMesh.rotation.y = 0.1 * elapsedTime;
  torusMesh.rotation.y = 0.1 * elapsedTime;

  sphereMesh.rotation.x = 0.15 * elapsedTime;
  planeMesh.rotation.x = 0.15 * elapsedTime;
  torusMesh.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
