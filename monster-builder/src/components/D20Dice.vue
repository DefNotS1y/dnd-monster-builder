<template>
  <div class="dice-container" ref="container">
    <canvas class="dice-canvas" ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
const canvas = ref(null)
let scene, camera, renderer, dice

// Create D20 geometry with proper vertices
function createD20Geometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 0)
  const material = new THREE.MeshPhongMaterial({
    color: 0xb8860b, // Golden color
    specular: 0x444444,
    shininess: 30,
    side: THREE.DoubleSide,
  })
  return new THREE.Mesh(geometry, material)
}

// Initialize Three.js scene
function initScene() {
  scene = new THREE.Scene()

  // Camera setup
  const aspect = container.value.clientWidth / container.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  camera.position.z = 3

  // Renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 2)
  scene.add(directionalLight)

  // Add dice
  dice = createD20Geometry()
  scene.add(dice)

  // Start animation
  animate()
}

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  if (dice) {
    dice.rotation.x += 0.01
    dice.rotation.y += 0.01
  }

  renderer.render(scene, camera)
}

// Handle window resize
function handleResize() {
  if (!container.value || !camera || !renderer) return

  const aspect = container.value.clientWidth / container.value.clientHeight
  camera.aspect = aspect
  camera.updateProjectionMatrix()

  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

// Lifecycle hooks
onMounted(() => {
  if (container.value && canvas.value) {
    initScene()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.dice-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;
  perspective: 1000px;
}

.dice-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
