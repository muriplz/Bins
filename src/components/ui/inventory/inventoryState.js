import { reactive, computed, readonly } from 'vue';
import InventoryManager from './InventoryManager';
import Position from './Position';
import Item from './Item';
import inventoryService from './inventoryService';

// Debounce helper
const debounce = (fn, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

export function createInventoryState() {
    // Create reactive state
    const state = reactive({
        inventoryManager: new InventoryManager({ width: 4, height: 4 }),
        loading: false,
        error: null,
        isDirty: false,
        lastSyncTime: null,
        isOpen: false,
    });

    // Computed properties
    const getters = {
        items: computed(() => {
            const items = [];
            state.inventoryManager.items.forEach(({ item, position }, id) => {
                items.push({
                    ...item,
                    position: { ...position }
                });
            });
            return items.value;
        }),

        grid: computed(() => {
            const { width, height } = state.inventoryManager;
            const grid = Array(height).fill().map(() => Array(width).fill(null));

            // Fill grid with item references
            state.inventoryManager.items.forEach(({ item, position }) => {
                for (let y = 0; y < item.height; y++) {
                    for (let x = 0; x < item.width; x++) {
                        const gridX = position.x + x;
                        const gridY = position.y + y;

                        if (gridX < width && gridY < height) {
                            grid[gridY][gridX] = {
                                itemId: item.id,
                                isOrigin: x === 0 && y === 0,
                                x, y
                            };
                        }
                    }
                }
            });

            return grid;
        }),

        isLoaded: computed(() => state.lastSyncTime !== null),
        canSync: computed(() => state.isDirty && !state.loading),
    };

    // Actions
    const actions = {
        async fetchInventory(options = {}) {
            const { force = false } = options;

            if (state.loading) return;

            // Only fetch if force=true, or inventory is not loaded, or inventory is open
            if (!force && state.lastSyncTime !== null && !state.isOpen) {
                return;
            }

            state.loading = true;
            state.error = null;

            try {
                const inventoryData = await inventoryService.getInventory(force);
                state.inventoryManager = new InventoryManager(inventoryData);
                state.lastSyncTime = Date.now();
                state.isDirty = false;
            } catch (error) {
                state.error = error.message || 'Failed to fetch inventory';
                console.error('Error fetching inventory:', error);
            } finally {
                state.loading = false;
            }
        },

        openInventory() {
            state.isOpen = true;
            actions.fetchInventory();
        },

        closeInventory() {
            state.isOpen = false;
        },

        async addItem(item, position) {
            const itemObj = item instanceof Item ? item : Item.fromJSON(item);
            const posObj = position instanceof Position ? position : new Position(position.x, position.y);

            const success = state.inventoryManager.addItem(itemObj, posObj);
            if (success) {
                state.isDirty = true;
                actions.syncInventory();
            }
            return success;
        },

        async removeItem(itemId) {
            const success = state.inventoryManager.removeItem(itemId);
            if (success) {
                state.isDirty = true;
                actions.syncInventory();
            }
            return success;
        },

        async moveItem(itemId, newPosition) {
            const posObj = newPosition instanceof Position ?
                newPosition : new Position(newPosition.x, newPosition.y);

            const success = state.inventoryManager.moveItem(itemId, posObj);
            if (success) {
                state.isDirty = true;

                // Update local cache immediately for responsive UI
                inventoryService.updateLocalInventory(state.inventoryManager);

                // Debounced sync to reduce API calls
                actions.debouncedSync();
            }
            return success;
        },

        // Regular sync
        async syncInventory() {
            if (!state.isDirty || state.loading) return;

            state.loading = true;

            try {
                await inventoryService.moveItem(
                    /* Use first dirty item - this is just a trigger */
                    state.inventoryManager.items.keys().next().value,
                    /* We're sending the full state anyway */
                    { x: 0, y: 0 }
                );
                state.isDirty = false;
                state.lastSyncTime = Date.now();
            } catch (error) {
                state.error = error.message || 'Failed to sync inventory';
                console.error('Error syncing inventory:', error);

                // Revert to server state on error
                actions.fetchInventory({ force: true });
            } finally {
                state.loading = false;
            }
        },

        // Debounced sync
        debouncedSync: debounce(function() {
            actions.syncInventory();
        }, 500) // 500ms debounce
    };

    return {
        state: readonly(state), // Make state readonly when exposed
        ...getters,
        ...actions
    };
}