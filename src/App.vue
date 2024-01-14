<script setup lang="ts">
import {
  RouterLink,
  RouterView
} from 'vue-router'
import {
  AnimationMixer,
  BoxGeometry,
  Clock,
  DirectionalLight,
  Fog,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderer
} from 'three'
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useTweakPane } from './composables/useTweakpane'
import {
  GLTFLoader,
  OrbitControls
} from 'three/examples/jsm/Addons.js'

const scene = new Scene()
const { width, height } = useWindowSize()
const aspectRatio = computed(
  () => width.value / height.value
)
let renderer: WebGLRenderer
let camera: PerspectiveCamera
let controls: OrbitControls
const loader = new GLTFLoader()
let mixer: any
loader.load(
  'http://localhost:8095/Dragon/DragonAttenuation.gltf',
  (gltf) => {
    console.log('suc', gltf)
    // gltf.scene.scale.set(0.5, 0.5, 0.5)
    // mixer = new AnimationMixer(gltf.scene)
    // const action = mixer.clipAction(
    //   gltf.animations[0]
    // )
    // action.play()
    // scene.add(gltf.scene)
    scene.add(gltf.scene.children[1])
  },
  (progress) => {
    console.log('progress', progress)
  },
  (error) => {
    console.log(error, 'error')
  }
)

const hemiLight = new HemisphereLight(
  0xffffff,
  0xffffff,
  1
)
const hemiLight2 = new HemisphereLight(
  0xfffff5,
  0xbf42f5,
  1
)
hemiLight.position.set(0, 50, 0)
hemiLight2.position.set(0, 5, 10)
scene.add(hemiLight)
const staticLight = new DirectionalLight(
  0xffffff,
  0.54
)
const staticLight2 = new DirectionalLight(
  0xbf42f5,
  1
)
const floor = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshStandardMaterial({
    color: '#ffffff',
    metalness: 1,
    roughness: 0.4,
    fog: true
  })
)
const floor2 = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshStandardMaterial({
    color: '#ffffff',
    metalness: 1,
    roughness: 0.4,
    fog: true
  })
)
const floor3 = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshStandardMaterial({
    color: '#ffffff',
    metalness: 1,
    roughness: 0.4,
    fog: true
  })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
floor.rotation.y = 0
floor.translateY(0)
floor.translateZ(-2)
scene.add(floor)
floor2.receiveShadow = true
// floor2.rotation.x = -Math.PI * 0.5
floor2.rotation.y = 0
floor2.translateZ(-10)
// floor2.rotateX(1.5)
// floor2.translateZ(-2)
scene.add(floor2)
staticLight.position.set(-8, 12, 8)
staticLight.castShadow = true
staticLight.shadow.mapSize = new Vector2(
  1024,
  1024
)
staticLight2.position.set(12, 10, 0)
staticLight2.castShadow = true
staticLight2.shadow.mapSize = new Vector2(
  1024,
  1024
)
scene.add(staticLight).add(staticLight2)

camera = new PerspectiveCamera(
  45,
  aspectRatio.value,
  0.1,
  100
)
scene.fog = new Fog(0xcccccc, 10, 15)
// camera.aspect =
// window.innerWidth / window.innerHeight
camera.position.z = 5
scene.add(camera)
const experience = ref<HTMLCanvasElement | null>(
  null
)
const cube = new Mesh(
  new BoxGeometry(1, 1, 1, 32, 32),
  new MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    fog: false
  })
)
// scene.add(cube)
function updateRenderer() {
  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(window.devicePixelRatio)
}

function updateCamera() {
  camera.aspect = aspectRatio.value
  camera.updateProjectionMatrix()
}

watch(aspectRatio, updateRenderer)

watch(aspectRatio, updateCamera)
const { fpsGraph } = useTweakPane()
const clock = new Clock()
const loop = () => {
  fpsGraph.begin()
  renderer.render(scene, camera)

  const delta = clock.getDelta()
  if (mixer) {
    mixer.update(delta)
  }

  controls.update()
  fpsGraph.end()
  requestAnimationFrame(loop)
}

onMounted(() => {
  renderer = new WebGLRenderer({
    canvas: experience.value as HTMLCanvasElement,
    antialias: true
  })

  controls = new OrbitControls(
    camera,
    renderer.domElement
  )

  controls.enableDamping = true

  updateRenderer()
  updateCamera()
  loop()
})
</script>

<template>
  <canvas ref="experience"> </canvas>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
