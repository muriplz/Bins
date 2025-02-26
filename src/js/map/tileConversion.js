// tileConversion.js - Fixed version
// Define the world origin (geographic coordinates of the center of your game world)
export const WORLD_ORIGIN = {
    lat: 43.4623, // Santander
    lon: -3.8098,
};

// Fixed zoom level for stability
export const DEFAULT_ZOOM = 16;

// Convert latitude/longitude to tile coordinates (for map APIs)
export function latLonToTile(lat, lon, zoom) {
    const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    return { x, y, zoom };
}

// Convert tile coordinates to latitude/longitude
export function tileToLatLon(x, y, zoom) {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
    const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    const lon = x / Math.pow(2, zoom) * 360 - 180;
    return { lat, lon };
}

// Calculate the scaling factor between world units and geographic coordinates
// This scaling factor will ensure consistent world size regardless of tile size
export function getScalingFactor(tileSize) {
    // Base scale for a reference tile size of 80
    const BASE_SCALE = 0.00025;

    // Scale proportionally to the tile size
    return BASE_SCALE * (80 / tileSize);
}

// Convert game world coordinates to lat/lon
export function worldToLatLon(x, z, tileSize) {
    const scalingFactor = getScalingFactor(tileSize);

    // Convert world coordinates to geographic offset
    const lonOffset = x * scalingFactor;
    const latOffset = z * scalingFactor;

    // Apply offset to origin
    const lon = WORLD_ORIGIN.lon + lonOffset;
    const lat = WORLD_ORIGIN.lat - latOffset; // Invert Z axis

    return { lat, lon };
}

// Convert lat/lon to game world coordinates
export function latLonToWorld(lat, lon, tileSize) {
    const scalingFactor = getScalingFactor(tileSize);

    // Calculate offsets from origin
    const lonOffset = lon - WORLD_ORIGIN.lon;
    const latOffset = WORLD_ORIGIN.lat - lat; // Invert Z axis

    // Convert to world coordinates
    const x = lonOffset / scalingFactor;
    const z = latOffset / scalingFactor;

    return { x, z };
}

// Convert game world coordinates to tile coordinates
export function worldToTile(x, z, tileSize, zoom = DEFAULT_ZOOM) {
    const { lat, lon } = worldToLatLon(x, z, tileSize);
    return latLonToTile(lat, lon, zoom);
}

// Convert tile coordinates to game world coordinates
export function tileToWorld(tileX, tileY, tileSize, zoom = DEFAULT_ZOOM) {
    const { lat, lon } = tileToLatLon(tileX, tileY, zoom);
    return latLonToWorld(lat, lon, tileSize);
}

// Get the width and height of a tile in world units
export function getTileWorldSize(tileSize) {
    return { width: tileSize, height: tileSize };
}