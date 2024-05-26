import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffedef'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
    })
    

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Gradients
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load("textures/gradients/3.jpg")
gradient.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradient
})

// shapes
const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4,16,60), material)
const cone = new THREE.Mesh(new THREE.ConeGeometry(1,2,32), material)
const knotTorus = new THREE.Mesh(new THREE.TorusKnotGeometry(.8,.35,100,16), material)

const objectsDistance = 4

torus.position.y = - objectsDistance * 0
cone.position.y = - objectsDistance * 1
knotTorus.position.y = - objectsDistance * 2

torus.position.x = 2
cone.position.x = -2
knotTorus.position.x = 2

scene.add(torus, cone,knotTorus)

const sectionMeshes = [torus, cone, knotTorus]

// Particles
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++){
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10 
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Scroll
let scrollY = window.scrollY //We create it so it's saved in the user first loading

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
})

// Cursor

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = e.clientY / sizes.height - 0.5

})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x
    const parallaxY = - cursor.y
    
    // ??
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.08
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.08

    for(const mesh of sectionMeshes){
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12    
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()