import Position from './Position';
import Item from './Item';

export default class InventoryManager {
    constructor(inventoryData = null) {
        this.id = inventoryData?.id || 0;
        this.userId = inventoryData?.user || 0;
        this.width = inventoryData?.width || 4;
        this.height = inventoryData?.height || 4;
        this.items = new Map();

        if (inventoryData?.itemPositions) {
            this.loadItems(inventoryData.itemPositions);
        }
    }

    loadItems(itemPositionsData) {
        this.items.clear();

        if (Array.isArray(itemPositionsData)) {
            itemPositionsData.forEach(entry => {
                const item = Item.fromJSON(entry.item);
                const position = new Position(entry.position.x, entry.position.y);
                this.items.set(item.id, { item, position });
            });
        } else if (typeof itemPositionsData === 'object') {
            Object.entries(itemPositionsData).forEach(([key, value]) => {
                const item = Item.fromJSON(JSON.parse(key));
                const position = new Position(value.x, value.y);
                this.items.set(item.id, { item, position });
            });
        }
    }

    getItem(itemId) {
        return this.items.get(itemId)?.item || null;
    }

    getItemPosition(itemId) {
        return this.items.get(itemId)?.position || null;
    }

    getItemsAt(position) {
        const result = [];

        this.items.forEach(({ item, position: itemPos }, itemId) => {
            if (this.isPositionWithinItem(position, item, itemPos)) {
                result.push(item);
            }
        });

        return result;
    }

    isPositionWithinItem(position, item, itemPosition) {
        return (
            position.x >= itemPosition.x &&
            position.x < itemPosition.x + item.width &&
            position.y >= itemPosition.y &&
            position.y < itemPosition.y + item.height
        );
    }

    isPositionValid(position) {
        return (
            position.x >= 0 &&
            position.y >= 0 &&
            position.x < this.width &&
            position.y < this.height
        );
    }

    canPlaceItem(item, position, skipItemId = null) {
        // Check if position is valid
        if (!this.isPositionValid(position) ||
            position.x + item.width > this.width ||
            position.y + item.height > this.height) {
            return false;
        }

        // Check if the item would overlap with any other item
        for (const [itemId, { item: existingItem, position: existingPos }] of this.items.entries()) {
            if (skipItemId === itemId) continue;

            if (this.doItemsOverlap(
                item, position,
                existingItem, existingPos
            )) {
                return false;
            }
        }

        return true;
    }

    doItemsOverlap(item1, pos1, item2, pos2) {
        return (
            pos1.x < pos2.x + item2.width &&
            pos1.x + item1.width > pos2.x &&
            pos1.y < pos2.y + item2.height &&
            pos1.y + item1.height > pos2.y
        );
    }

    addItem(item, position) {
        if (!this.canPlaceItem(item, position)) {
            return false;
        }

        this.items.set(item.id, { item, position });
        return true;
    }

    removeItem(itemId) {
        return this.items.delete(itemId);
    }

    moveItem(itemId, newPosition) {
        const itemData = this.items.get(itemId);
        if (!itemData) return false;

        if (!this.canPlaceItem(itemData.item, newPosition, itemId)) {
            return false;
        }

        itemData.position = newPosition;
        return true;
    }

    toServerFormat() {
        const itemPositions = [];

        this.items.forEach(({ item, position }) => {
            itemPositions.push({
                item: item.toJSON(),
                position: { x: position.x, y: position.y }
            });
        });

        return {
            id: this.id,
            user: this.userId,
            width: this.width,
            height: this.height,
            itemPositions
        };
    }
}