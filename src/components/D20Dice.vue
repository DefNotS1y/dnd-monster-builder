&lt;template>
  &lt;div ref="container" class="dice-container" @click="onDiceClick">
    &lt;canvas ref="diceCanvas" class="dice-canvas">&lt;/canvas>
  &lt;/div>
&lt;/template>

&lt;script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

const container = ref(null)
const diceCanvas = ref(null)
let renderer, scene, camera, dice, physicsWorld, diceMesh, diceBody
let isAnimating = false
const animationDuration = 2000 // 2 seconds

// Material properties
const diceMaterial = {
  color: 0x2a1c0f,
  specular: 0x172022,
  shininess: 40,
}

// Create D20 geometry
function createD20Geometry(radius) {
  const phi = (1 + Math.sqrt(5)) / 2
  const vertices = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
  ]

  const geometry = new THREE.IcosahedronGeometry(radius)
  const materials = []

  // Create materials for each face
  for (let i = 0; i &lt; 20; i++) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = canvas.height = 128

    // Fill the face with gradient
    const gradient = context.createLinearGradient(0, 0, 0, 128)
    gradient.addColorStop(0, '#2a1c0f')
    gradient.addColorStop(1, '#402917')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)

    // Add the number
    context.font = '48px MedievalSharp'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = '#B8860B'
    context.fillText(i + 1, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    materials.push(new THREE.MeshPhongMaterial({
      map: texture,
      specular: diceMaterial.specular,
      shininess: diceMaterial.shininess,
    }))
  }

  return { geometry, materials }
}

// Initialize physics
function initPhysics() {
  physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
  })
}

// Initialize Three.js scene
function initScene() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({
    canvas: diceCanvas.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  // Create dice
  const { geometry, materials } = createD20Geometry(1)
  diceMesh = new THREE.Mesh(geometry, materials)
  scene.add(diceMesh)

  // Create physics body
  const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
  diceBody = new CANNON.Body({
    mass: 1,
    shape: shape
  })
  physicsWorld.addBody(diceBody)
}

// Animation loop
function animate() {
  if (!isAnimating) return

  requestAnimationFrame(animate)

  // Update physics
  physicsWorld.step(1/60)

  // Update mesh position
  diceMesh.position.copy(diceBody.position)
  diceMesh.quaternion.copy(diceBody.quaternion)

  // Render
  renderer.render(scene, camera)
}

// Handle click
function onDiceClick() {
  if (isAnimating) return

  isAnimating = true
  
  // Apply random impulse
  const impulse = new CANNON.Vec3(
    Math.random() * 10 - 5,
    Math.random() * 10 + 5,
    Math.random() * 10 - 5
  )
  diceBody.applyImpulse(impulse)

  // Start animation
  animate()

  // Stop after duration
  setTimeout(() => {
    isAnimating = false
  }, animationDuration)
}

// Resize handler
function onResize() {
  if (!container.value || !camera || !renderer) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

// Lifecycle hooks
onMounted(() => {
  // Wait for next tick to ensure DOM is ready
  nextTick(() => {
    initPhysics()
    initScene()
    animate()
    
    // Initial resize
    onResize()
    
    // Handle window resize
    window.addEventListener('resize', onResize)
  })
})

onUnmounted(() => {
  // Stop animation
  isAnimating = false
  
  // Clean up physics
  if (physicsWorld) {
    physicsWorld.bodies.forEach(body => {
      physicsWorld.removeBody(body)
    })
  }
  
  // Clean up Three.js resources
  if (renderer) {
    renderer.dispose()
  }
  if (diceMesh) {
    // Dispose of geometry
    diceMesh.geometry.dispose()
    
    // Dispose of materials and textures
    if (Array.isArray(diceMesh.material)) {
      diceMesh.material.forEach(material => {
        if (material.map) {
          material.map.dispose()
        }
        material.dispose()
      })
    } else if (diceMesh.material) {
      if (diceMesh.material.map) {
        diceMesh.material.map.dispose()
      }
      diceMesh.material.dispose()
    }
    
    // Remove from scene
    scene.remove(diceMesh)
  }
  
  // Clean up scene
  scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose()
    }
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose())
      } else {
        object.material.dispose()
      }
    }
  })
  
  // Remove event listeners
  window.removeEventListener('resize', onResize)
})
&lt;/script>

&lt;style scoped>
.dice-container {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.dice-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
}
&lt;/style>
