<template>
  <div
      class="grid-cell"
      :class="{
      'occupied': isOccupied,
      'drop-valid': isDropValid && !isOccupied,
      'drop-invalid': isDropTarget && !isDropValid
    }"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
      :data-x="x"
      :data-y="y"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GridCell',

  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    isOccupied: {
      type: Boolean,
      default: false
    },
    itemRef: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      isDropTarget: false,
      isDropValid: false
    };
  },

  methods: {
    onDragOver(event) {
      this.isDropTarget = true;

      // Get dragged item data
      const itemData = JSON.parse(event.dataTransfer.getData('application/json') || '{}');

      if (!itemData.id) {
        this.isDropValid = false;
        return;
      }

      // Calculate if drop is valid (would be done by inventory manager)
      this.$store.state.inventory.inventoryManager.canPlaceItem(
          itemData,
          { x: this.x, y: this.y },
          itemData.id
      );

      // Set dropEffect based on validity
      event.dataTransfer.dropEffect = this.isDropValid ? 'move' : 'none';
    },

    onDragLeave() {
      this.isDropTarget = false;
      this.isDropValid = false;
    },

    onDrop(event) {
      this.isDropTarget = false;
      this.isDropValid = false;

      const itemData = JSON.parse(event.dataTransfer.getData('application/json') || '{}');

      if (!itemData.id) return;

      this.$emit('item-dropped', {
        itemId: itemData.id,
        position: { x: this.x, y: this.y }
      });
    }
  }
};
</script>

<style scoped>
.grid-cell {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  box-sizing: border-box;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

.grid-cell.occupied {
  background-color: rgba(200, 200, 200, 0.3);
}

.grid-cell.drop-valid {
  background-color: rgba(100, 255, 100, 0.2);
  border: 1px dashed #4caf50;
}

.grid-cell.drop-invalid {
  background-color: rgba(255, 100, 100, 0.2);
  border: 1px dashed #f44336;
}
</style>