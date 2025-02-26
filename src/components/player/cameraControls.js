import * as THREE from 'three';

const targetPosition = new THREE.Vector3();

export const updateCameraPosition = (position, offset, cameraControls) => {
    if (!cameraControls) return;

    // Set target to player position
    targetPosition.set(
        position.x,
        position.y + 1.5, // Adjust for player height
        position.z
    );

    // Calculate desired camera position based on offset
    const desiredX = position.x + offset.x;
    const desiredY = position.y + offset.y;
    const desiredZ = position.z + offset.z;

    // Update the camera position and target
    cameraControls.setLookAt(
        desiredX, desiredY, desiredZ, // Camera position
        targetPosition.x, targetPosition.y, targetPosition.z, // Target position
        true
    );
};