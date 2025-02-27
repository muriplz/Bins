<template>
  <div
      class="inventory-item"
      :class="{ 'is-dragging': isDragging }"
      :style="itemStyle"
      draggable="true"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
  >
    <div class="item-content">
      <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="item-image">
      <div v-else class="item-placeholder">
        {{ item.name.substring(0, 2).toUpperCase() }}
      </div>
      <div class="item-name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryItem',

  props: {
    item: {
      type: Object,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    cellSize: {
      type: Number,
      default: 60
    }
  },

  data() {
    return {
      isDragging: false
    };
  },

  computed: {
    itemStyle() {
      return {
        width: `${this.item.width * this.cellSize}px`,
        height: `${this.item.height * this.cellSize}px`,
        gridColumn: `span ${this.item.width}`,
        gridRow: `span ${this.item.height}`,
        backgroundColor: this.generateItemColor(this.item.id)
      };
    }
  },

  methods: {
    onDragStart(event) {
      this.isDragging = true;

      // Set drag data
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/json', JSON.stringify(this.item));

      // Create a custom drag image if needed
      // const dragImage = event.target.cloneNode(true);
      // document.body.appendChild(dragImage);
      // event.dataTransfer.setDragImage(dragImage, 0, 0);
      // setTimeout(() => document.body.removeChild(dragImage), 0);
    },

    onDragEnd() {
      this.isDragging = false;
    },

    generateItemColor(id) {
      // Generate a consistent color based on item id
      const hash = Array.from(id.toString()).reduce(
          (hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0
      );
      const hue = Math.abs(hash) % 360;
      return `hsla(${hue}, 70%, 80%, 0.8)`;
    }
  }
};
</script>

<style scoped>
.inventory-item {
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
}

.inventory-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.inventory-item.is-dragging {
  opacity: 0.6;
  transform: scale(0.95);
}

.item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px;
  box-sizing: border-box;
}

.item-image {
  max-width: 100%;
  max-height: 70%;
  object-fit: contain;
}

.item-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70%;
  font-size: 1.2rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
}

.item-name {
  margin-top: 4px;
  font-size: 0.8rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>