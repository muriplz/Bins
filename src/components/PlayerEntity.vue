<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { positionData, setupControls, removeControls } from './playerControls'
import { Cylinder } from '@tresjs/cientos'

const color = ref('orange')

onMounted(() => {
  setupControls()
})

onUnmounted(() => {
  removeControls()
})
</script>

<template>
  <TresMesh :position="[positionData.x, positionData.y + 1.6, positionData.z]">
    <Cylinder :args="[1, 1, 3, 32]">
      <TresMeshToonMaterial :color="color"/>
    </Cylinder>
  </TresMesh>
</template>

<style scoped>
</style>