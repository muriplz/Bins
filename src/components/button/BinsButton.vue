<script setup>
</script>

<template>
  <button class="bins-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.bins-button {
  /* Add your button styles here */
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bins-button:hover {
  background-color: #0056b3;
}
</style>