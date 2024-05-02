import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import typeFaceFont from '../static/fonts/helvetiker_regular.typeface.json';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load('textures/matcaps/9.png');

// Fonts
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Arantza pasa el poto', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();

  const material = new THREE.MeshNormalMaterial();
  //   textMaterial.wireframe = true;

  const mesh_1 = new THREE.Mesh(textGeometry, material);

  scene.add(mesh_1);

  console.time('torus');
  const torusGeometry = new THREE.SphereGeometry(0.7, 0.2, 0, 45);

  for (let i = 0; i < 100; i++) {
    const torus = new THREE.Mesh(torusGeometry, material);

    torus.position.x = (Math.random() - 0.5) * 10;
    torus.position.y = (Math.random() - 0.5) * 10;
    torus.position.z = (Math.random() - 0.5) * 10;

    torus.rotation.x = Math.random() * Math.PI;
    torus.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    torus.scale.set(scale, scale, scale);

    scene.add(torus);
  }
  console.timeEnd('torus');
});

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

/**
 * Sizes
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
camera.position.z = 2;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
