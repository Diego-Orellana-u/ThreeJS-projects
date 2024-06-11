import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import GUI from "lil-gui";
import { color } from "three/examples/jsm/nodes/Nodes.js";

const textureLoader = new THREE.TextureLoader();

// Rings textures
const ringsTexture = textureLoader.load("/textures/rings/rings.png");
const ringsMetallic = textureLoader.load("/textures/rings/ringsMetallic.png");
const ringsNormal = textureLoader.load("/textures/rings/ringsNormal.png");
const ringsRoughness = textureLoader.load("/textures/rings/ringsRoughness.png");
ringsTexture.encoding = THREE.SRGBColorSpace;

// Moon textures
const moonTexture = textureLoader.load("/textures/moon/moon.png");
const moonMetallic = textureLoader.load("/textures/moon/moonMetallic.png");
const moonNormal = textureLoader.load("/textures/moon/moonNormal.png");
const moonRoughness = textureLoader.load("/textures/moon/moonRoughness.png");

// Saturn textures
const saturnTexture = textureLoader.load("/textures/saturn/saturn.png");
const saturnNormal = textureLoader.load("/textures/saturn/saturnNormal.png");
const saturnRoughness = textureLoader.load(
  "/textures/saturn/saturnRoughness.png"
);
const saturnMetallic = textureLoader.load("/textures/saturn/saturnMetalic.png");

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// // loaders
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("/draco/");

// const gltfLoader = new GLTFLoader();
// gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshStandardMaterial({
//     color: "#444444",
//     metalness: 0,
//     roughness: 0.5,
//   })
// );
// floor.receiveShadow = true;
// floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial();

particlesMaterial.size = 0.2;
particlesMaterial.sizeAttenuation = true;
const particlesColor = new THREE.Color(0x555555);
particlesMaterial.color = particlesColor;

const count = 5000;
const radius = 20;
const positions = new Float32Array(count * 3);

let x = null;
let y = null;
let z = null;

for (let i = 0; i < count; i++) {
  do {
    x = (Math.random() - 0.5) * 200;
    y = (Math.random() - 0.5) * 200;
    z = (Math.random() - 0.5) * 200;
  } while (Math.sqrt(x * x + y * y + z * z) < radius);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfdfae4, 2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 1, 5);
// const helper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLight);

const mtlLoader = new MTLLoader();
mtlLoader.load("/models/planet/planet.mtl", (materials) => {
  materials.preload();

  // console.log(materials.materials);

  // Rings
  materials.materials.Rings.map = ringsTexture;
  materials.materials.Rings.normalMap = ringsNormal;
  materials.materials.Rings.normalScale = new THREE.Vector2(0.1, 0.1);
  materials.materials.Rings.roughnessMap = ringsRoughness;
  materials.materials.Rings.metalnessMap = ringsMetallic;
  materials.materials.Rings.transparent = true;
  const ringsColor = new THREE.Color();
  ringsColor.setRGB(1.8, 1.5, 1.5);
  materials.materials.Rings.color = ringsColor;
  materials.materials.Rings.opacity = 0.5;
  materials.materials.Rings.emissive.setRGB(0.4, 0, 0);

  // Moon
  materials.materials.MOON.map = moonTexture;
  materials.materials.MOON.normalMap = moonNormal;
  materials.materials.MOON.normalScale = new THREE.Vector2(0.2, 0.2);
  materials.materials.MOON.roughnessMap = moonRoughness;
  materials.materials.MOON.metalnessMap = moonMetallic;
  materials.materials.MOON.shininess = 20;

  // saturn
  materials.materials.Saturn.map = saturnTexture;
  materials.materials.Saturn.normalMap = saturnNormal;
  materials.materials.Saturn.normalScale = new THREE.Vector2(0.25, 0.25);
  materials.materials.Saturn.roughnessMap = saturnRoughness;
  materials.materials.Saturn.metalnessMap = saturnMetallic;
  materials.materials.Saturn.shininess = 20;
  const saturnColor = new THREE.Color();
  saturnColor.setRGB(0.95, 0.6, 0.7);
  materials.materials.Saturn.color = saturnColor;

  // console.log(materials);

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load("/models/planet/planet.obj", (obj) => {
    const children = [...obj.children];
    for (const child of children) {
      child.castShadow = true;
      child.receiveShadow = true;
      scene.add(child);
    }
  });
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
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
camera.rotation.x = Math.PI * 0.25;
camera.position.set(4, 0, 3);
scene.add(camera);

const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.9, 0);
controls.enableDamping = true;

// controls.object.position.set(2, 1, 5);
// controls.object.rotation.set(10, 5, 2);
// console.log(controls.object);

controls.update();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaFactor = 2.2;
renderer.gammaOutput = true;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
