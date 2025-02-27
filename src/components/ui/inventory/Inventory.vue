<template>
  <div class="inventory-container" :class="{ 'is-loading': inventoryState.state.loading }">
    <div class="inventory-header">
      <h2>Inventory</h2>
      <div class="inventory-actions">
        <button
            class="refresh-button"
            @click="refreshInventory"
            :disabled="inventoryState.state.loading"
        >
          Refresh
        </button>
      </div>
    </div>

    <div class="inventory-grid" :style="gridStyle">
      <template v-for="(row, y) in inventoryState.grid" :key="`row-${y}`">
        <grid-cell
            v-for="(cell, x) in row"
            :key="`cell-${x}-${y}`"
            :x="x"
            :y="y"
            :is-occupied="cell !== null"
            :item-ref="cell"
            @item-dropped="onItemDropped"
        >
          <!-- Render item only at its origin cell -->
          <inventory-item
              v-if="cell && cell.isOrigin"
              :item="getItemById(cell.itemId)"
              :position="{ x, y }"
              :cell-size="cellSize"
          />
        </grid-cell>
      </template>
    </div>

    <div v-if="inventoryState.state.loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div v-if="inventoryState.state.error" class="error-message">
      {{ inventoryState.state.error }}
    </div>
  </div>
</template>

<script>
import { inject, computed, onMounted, onBeforeUnmount } from 'vue';
import GridCell from './GridCell.vue';
import InventoryItem from './InventoryItem.vue';

export default {
  name: 'Inventory',

  components: {
    GridCell,
    InventoryItem
  },

  props: {
    cellSize: {
      type: Number,
      default: 60
    }
  },

  setup(props) {
    // Inject the inventory state from the app
    const inventoryState = inject('inventoryState');

    const gridStyle = computed(() => {
      const { width, height } = inventoryState.state.inventoryManager;
      return {
        gridTemplateColumns: `repeat(${width}, ${props.cellSize}px)`,
        gridTemplateRows: `repeat(${height}, ${props.cellSize}px)`
      };
    });

    // Fetch inventory data when component is created
    inventoryState.fetchInventory();

    onMounted(() => {
      inventoryState.openInventory();

      // Add event listener for when leaving page to save inventory if dirty
      window.addEventListener('beforeunload', handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      inventoryState.closeInventory();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    const refreshInventory = () => {
      inventoryState.fetchInventory({ force: true });
    };

    const getItemById = (itemId) => {
      return inventoryState.items.find(item => item.id === itemId);
    };

    const onItemDropped = ({ itemId, position }) => {
      inventoryState.moveItem(itemId, position);
    };

    const handleBeforeUnload = (event) => {
      // Sync inventory if dirty before page unload
      if (inventoryState.state.isDirty) {
        inventoryState.syncInventory();

        // Show confirmation dialog if changes might be lost
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        event.returnValue = message;
        return message;
      }
    };

    return {
      inventoryState,
      gridStyle,
      refreshInventory,
      getItemById,
      onItemDropped,
      handleBeforeUnload
    };
  }
};
</script>

<style scoped>
.inventory-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.inventory-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.refresh-button {
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.inventory-grid {
  display: grid;
  gap: 1px;
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  text-align: center;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>