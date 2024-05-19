import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Parameters
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.branches = 3;
parameters.radius = 5;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.innerColor = '#f12f43';
parameters.outerColor = '#823293';

/**
 * Galaxy Generator
 */

let geometry = null;
let particlesMaterial = null;
let points = null;

const galaxyGenerator = () => {
  if (points) {
    geometry.dispose();
    particlesMaterial.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.innerColor);
  const colorOutside = new THREE.Color(parameters.outerColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    // ??
    const radius = Math.random() * parameters.radius;

    // ??
    const spinAngle = radius * parameters.spin;

    // ??
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    vertices[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    vertices[i3 + 1] = randomY;
    vertices[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    // ??
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  particlesMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, particlesMaterial);
  scene.add(points);
};

galaxyGenerator();

gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, 'radius')
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

gui.addColor(parameters, 'innerColor').onChange(galaxyGenerator);

gui.addColor(parameters, 'outerColor').onChange(galaxyGenerator);

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
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
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
