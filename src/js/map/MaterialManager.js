import * as THREE from 'three';
import { tileLoader } from './TileLoader.js';

// Manages materials separately from Vue's reactivity system
class MaterialManager {
    constructor() {
        this.materials = new Map();
        this.placeholderMaterial = new THREE.MeshStandardMaterial({
            color: "#e8e0d8", // Neutral terrain color
            roughness: 0.8,
            metalness: 0.1
        });

        // Default style for all map tiles
        this.defaultStyle = 'no-labels';
    }

    // Get or create a material for a specific tile
    getMaterial(tileId, zoom, x, y, style = null) {
        // Use existing material if available
        if (this.materials.has(tileId)) {
            return this.materials.get(tileId);
        }

        // Always use specified style or default to no-labels
        const tileStyle = style || this.defaultStyle;

        // Create a new material (initially with no texture)
        const material = new THREE.MeshStandardMaterial({
            color: "#e8e0d8", // Match placeholder color
            roughness: 0.8,
            metalness: 0.1
        });

        // Store in cache
        this.materials.set(tileId, material);

        // Load texture and update material when ready
        tileLoader.loadTile(zoom, x, y, {
            style: tileStyle,
            priority: 'high'
        })
            .then(texture => {
                // Check if material still exists
                if (this.materials.has(tileId)) {
                    material.map = texture;
                    material.needsUpdate = true;
                }
            });

        return material;
    }

    // Get placeholder material
    getPlaceholderMaterial() {
        return this.placeholderMaterial;
    }

    // Cleanup unused materials
    cleanup(activeTileIds) {
        const activeIds = new Set(activeTileIds);

        for (const id of this.materials.keys()) {
            if (!activeIds.has(id)) {
                const material = this.materials.get(id);
                material.dispose();
                this.materials.delete(id);
            }
        }
    }
}

// Export singleton
export const materialManager = new MaterialManager();