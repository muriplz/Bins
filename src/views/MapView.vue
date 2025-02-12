<script setup>
import { TresCanvas } from '@tresjs/core'
import OrbitControls from "../components/OrbitControls.vue"
import { Sky, Stats } from '@tresjs/cientos'
import PlayerEntity from "../components/PlayerEntity.vue"
import InfinitePlane from "../components/InfinitePlane.vue"
import { Cylinder } from '@tresjs/cientos'

</script>

<template>
  <TresCanvas window-size>
    <Sky/>
    <Stats/>
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" ref=""/>
    <PlayerEntity/>
    <OrbitControls/>
    <InfinitePlane/>
    <Cylinder :args="[1, 1, 3, 32]">
      <TresMeshToonMaterial :color="'green'"/>
    </Cylinder>
    <TresAmbientLight :intensity="1"/>
  </TresCanvas>
</template>

<style scoped>
</style>