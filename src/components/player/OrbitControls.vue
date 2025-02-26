<script setup>
import {CameraControls, BaseCameraControls} from '@tresjs/cientos'
import {nextTick, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {positionData, setupControls, removeControls, setCameraInstance} from './playerControls.js'
import {updateCameraPosition} from './cameraControls.js'

const DRAG_SENSITIVITY = 1.20
const MIN_DISTANCE = 2
const MAX_DISTANCE = 70
const ZOOM_SPEED = 0.5
const DEAD_ZONE_RADIUS = 20
const MIN_POLAR_ANGLE = Math.PI * (25 / 180)
const MAX_POLAR_ANGLE = Math.PI * (87 / 180)

const isDragging = ref(false)
const lastAngle = ref(0)
const lastY = ref(0)
const currentDistance = ref(10)

const controlsRef = ref(null);
const offsetPos = reactive({x: 0, y: 0, z: 0});

const onReady = (instance) => {
  controlsRef.value = instance;
  currentDistance.value = instance.distance;

  // Set initial position
  if (instance) {
    instance.setTarget(positionData.x, positionData.y + 1.5, positionData.z);
    instance.distance = currentDistance.value;
  }

  if (instance?._camera) {
    setCameraInstance(instance._camera);
  }
};

watch(() => controlsRef.value?.instance?._camera, (newCamera) => {
  if (newCamera) {
    console.log('Camera instance updated:', newCamera);
    setCameraInstance(newCamera);
  }
}, { immediate: true });

onUnmounted(() => {
  removeControls(); // Call removeControls
});

onMounted(() => {
  const canvas = document.querySelector('canvas')
  if (!canvas) return

  const getAngleFromCenter = (x, y) => {
    const rect = canvas.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    return Math.atan2(y - centerY, x - centerX)
  }

  const getDistanceFromCenter = (x, y) => {
    const rect = canvas.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = x - centerX
    const dy = y - centerY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleStart = (x, y) => {
    if (getDistanceFromCenter(x, y) > DEAD_ZONE_RADIUS) {
      isDragging.value = true
      lastAngle.value = getAngleFromCenter(x, y)
      lastY.value = y
    }
  }

  const handleMove = (x, y) => {
    if (!isDragging.value || !controlsRef.value?.instance) return

    const distanceFromCenter = getDistanceFromCenter(x, y)
    if (distanceFromCenter <= DEAD_ZONE_RADIUS) {
      return
    }

    const currentAngle = getAngleFromCenter(x, y)
    let deltaAngle = currentAngle - lastAngle.value

    if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2
    if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2

    const cameraControl = controlsRef.value.instance

    const distanceScale = Math.min(1, (distanceFromCenter - DEAD_ZONE_RADIUS) / DEAD_ZONE_RADIUS)

    if (cameraControl.azimuthAngle !== undefined) {
      cameraControl.azimuthAngle += deltaAngle * DRAG_SENSITIVITY * distanceScale
    }

    const deltaY = (y - lastY.value) * 0.005 * distanceScale
    if (cameraControl.polarAngle !== undefined) {
      const newPolarAngle = Math.min(MAX_POLAR_ANGLE,
          Math.max(MIN_POLAR_ANGLE,
              cameraControl.polarAngle - deltaY))
      cameraControl.polarAngle = newPolarAngle
    }
    setOffset();
    cameraControl.update()

    lastAngle.value = currentAngle
    lastY.value = y
    currentDistance.value = cameraControl.distance; // Update currentDistance
  }

  const handleEnd = () => {
    isDragging.value = false
    if (controlsRef.value?.instance) {
      currentDistance.value = controlsRef.value.instance.distance; // Update currentDistance
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    handleStart(e.clientX, e.clientY)
  })

  canvas.addEventListener('mousemove', (e) => {
    handleMove(e.clientX, e.clientY)
  })

  canvas.addEventListener('mouseup', handleEnd)
  canvas.addEventListener('mouseleave', handleEnd)

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault()
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    }
  }, {passive: false})

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault()
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }
  }, {passive: false})

  canvas.addEventListener('touchend', handleEnd)
  canvas.addEventListener('touchcancel', handleEnd)

  let lastTouchDistance = 0

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDistance = Math.sqrt(dx * dx + dy * dy)
    }
  })

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && controlsRef.value?.instance) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const distance = Math.sqrt(dx * dx + dy * dy)

      const delta = lastTouchDistance - distance
      const cameraControl = controlsRef.value.instance
      let newDistance = cameraControl.distance + (delta * 0.01)

      newDistance = Math.min(MAX_DISTANCE, Math.max(MIN_DISTANCE, newDistance))
      cameraControl.distance = newDistance
      cameraControl.update()

      lastTouchDistance = distance
      currentDistance.value = newDistance; // Update currentDistance
    }
  })

  canvas.addEventListener('wheel', (e) => {
    if (!controlsRef.value?.instance) return

    e.preventDefault()

    const cameraControl = controlsRef.value.instance
    let distance = cameraControl.distance

    if (e.deltaY > 0) {
      distance = Math.min(distance + ZOOM_SPEED, MAX_DISTANCE)
    } else {
      distance = Math.max(distance - ZOOM_SPEED, MIN_DISTANCE)
    }

    cameraControl.distance = distance
    cameraControl.update()
    currentDistance.value = distance; // Update currentDistance
  }, {passive: false})

  onReady(controlsRef.value?.instance)

  if (controlsRef.value?.instance?._camera) {
    setCameraInstance(controlsRef.value.instance._camera);
  }
})

const setOffset = () => {
  const target = controlsRef.value.instance._target;
  const cameraPosition = controlsRef.value.instance._camera.position;

  // Calculate offset from camera to target (reversed from your original)
  offsetPos.x = (!isNaN(target.x) && !isNaN(cameraPosition.x)) ? cameraPosition.x - target.x : 0;
  offsetPos.y = (!isNaN(target.y) && !isNaN(cameraPosition.y)) ? cameraPosition.y - target.y : 0;
  offsetPos.z = (!isNaN(target.z) && !isNaN(cameraPosition.z)) ? cameraPosition.z - target.z : 0;
};

watch(positionData, (newPosition) => {
  setOffset();
  updateCameraPosition(newPosition, offsetPos, controlsRef.value.instance, currentDistance.value);
  if (controlsRef.value?.instance) {
    controlsRef.value.instance.setTarget(newPosition.x, newPosition.y, newPosition.z);
  }
}, {deep: true});
</script>

<template>
  <CameraControls
      ref="controlsRef"
      @ready="onReady"
      :min-distance="MIN_DISTANCE"
      :max-distance="MAX_DISTANCE"
      :min-polar-angle="MIN_POLAR_ANGLE"
      :max-polar-angle="MAX_POLAR_ANGLE"
      :truck-speed="0"
      :azimuth-rotate-speed="0"
      :polar-rotate-speed="0"
      :smooth-time="0"
      :drag-to-offset="false"
      :mouse-buttons="{
      left: BaseCameraControls.ACTION.NONE,
      right: BaseCameraControls.ACTION.NONE,
      middle: BaseCameraControls.ACTION.NONE,
      wheel: BaseCameraControls.ACTION.NONE
    }"
      make-default
  />
</template>