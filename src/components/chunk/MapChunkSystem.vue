<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { positionData } from '../player/playerControls.js';

// Configuration props
const props = defineProps({
  renderDistance: {
    type: Number,
    default: 1
  },
  zoom: {
    type: Number,
    default: 12
  },
  chunkSize: {
    type: Number,
    default: 20
  }
});

// State
const visibleChunks = ref([]);
const isInitialized = ref(false);

// Get current chunk coordinates based on player position
const getCurrentChunk = () => {
  const x = Math.floor(positionData.x / props.chunkSize);
  const z = Math.floor(positionData.z / props.chunkSize);
  return { x, z };
};

// Get tile URL from Carto
const getTileUrl = (tileX, tileY, zoom) => {
  return `https://a.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${tileX}/${tileY}.png`;
};

// Convert chunk coordinates to tile coordinates
const chunkToTile = (chunkX, chunkZ) => {
  // Starting point for tile coordinates - adjust as needed
  const baseTileX = 3636;
  const baseTileY = 1612;
  return {
    x: baseTileX + chunkX,
    y: baseTileY + chunkZ
  };
};

// Generate chunks around the player
const updateVisibleChunks = () => {
  if (!isInitialized.value) return;

  // Get current chunk
  const centerChunk = getCurrentChunk();
  const newChunks = [];

  // Generate chunk data for the area around the player
  for (let dx = -props.renderDistance; dx <= props.renderDistance; dx++) {
    for (let dz = -props.renderDistance; dz <= props.renderDistance; dz++) {
      const chunkX = centerChunk.x + dx;
      const chunkZ = centerChunk.z + dz;

      // Get tile coordinates
      const { x: tileX, y: tileY } = chunkToTile(chunkX, chunkZ);

      // Create a unique ID for this chunk
      const id = `chunk_${chunkX}_${chunkZ}`;

      // Add to visible chunks
      newChunks.push({
        id,
        chunkX,
        chunkZ,
        position: [chunkX * props.chunkSize, 0, chunkZ * props.chunkSize],
        textureUrl: getTileUrl(tileX, tileY, props.zoom)
      });
    }
  }

  visibleChunks.value = newChunks;
};

// Watch for player position changes
watch(() => [positionData.x, positionData.z], () => {
  updateVisibleChunks();
}, { deep: true });

// Initialize after component is mounted
onMounted(() => {
  // Short delay to ensure TresJS is ready
  setTimeout(() => {
    isInitialized.value = true;
    updateVisibleChunks();
  }, 500);
});

// Expose methods and props for parent component
defineExpose({
  updateVisibleChunks,
  renderDistance: computed(() => props.renderDistance)
});
</script>

<template>
  <TresGroup>
    <TresGroup v-for="chunk in visibleChunks" :key="chunk.id" :position="chunk.position">
      <TresPlane :args="[props.chunkSize, props.chunkSize]" :rotation="[-Math.PI/2, 0, 0]">
        <TresMeshBasicMaterial :map="null" color="#cccccc" side="double">
          <TresTextureLoader :url="chunk.textureUrl" :wrap-s="2501" :wrap-t="2501" />
        </TresMeshBasicMaterial>
      </TresPlane>
    </TresGroup>
  </TresGroup>
</template>