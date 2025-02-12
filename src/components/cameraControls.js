import { ref } from 'vue'

export const updateCameraPosition = (position, offset, cameraControls) => {
    if (!cameraControls) return

    // Calculate target position
    const targetX = position.x
    const targetZ = position.z
    const targetY = position.y || 0

    // Calculate camera position with offset
    const cameraX = position.x + offset.x
    const cameraZ = position.z + offset.z
    const cameraY = cameraControls.camera.position.y // Keep current height

    // Use setLookAt for smooth transition
    return cameraControls.setLookAt(
        cameraX,
        cameraY,
        cameraZ,
        targetX,
        targetY,
        targetZ,
        true // Enable smooth transition
    )
}