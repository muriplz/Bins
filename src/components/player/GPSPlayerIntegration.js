import { watch } from 'vue';
import { gpsWorldPosition } from './GPSTracker.js';
import { position, positionData } from './playerControls.js';

// Flag to control if GPS should drive player position
let isGPSControlActive = false;

// Enable GPS control of player position
function enableGPSControl() {
    isGPSControlActive = true;
}

// Disable GPS control of player position
function disableGPSControl() {
    isGPSControlActive = false;
}

// Toggle GPS control
function toggleGPSControl() {
    isGPSControlActive = !isGPSControlActive;
    return isGPSControlActive;
}

// Get current GPS control status
function getGPSControlStatus() {
    return isGPSControlActive;
}

// Watch for GPS position changes and update player position
watch(gpsWorldPosition, (newPos) => {
    if (isGPSControlActive && gpsWorldPosition.isActive) {
        // Update the position data reactive object
        positionData.x = newPos.x;
        positionData.z = newPos.z;

        // Update the THREE.js Vector3
        position.set(newPos.x, positionData.y, newPos.z);

        console.log("Player position updated from GPS:", {
            x: position.x,
            y: position.y,
            z: position.z
        });
    }
}, { deep: true });

export {
    enableGPSControl,
    disableGPSControl,
    toggleGPSControl,
    getGPSControlStatus
};