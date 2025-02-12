
export const updateCameraPosition = (position, offset, cameraControls) => {
    if (!cameraControls) return

    const targetX = position.x
    const targetZ = position.z

    const cameraX = position.x + offset.x
    const cameraZ = position.z + offset.z

    // Validate positions to avoid NaN values
    if (isNaN(cameraX) || isNaN(cameraZ) || isNaN(targetX) || isNaN(targetZ)) {
        console.error('Invalid camera or target position:', { cameraX, cameraZ, targetX, targetZ });
        return
    }

    return cameraControls.setLookAt(
        cameraX,
        cameraControls._camera.position.y,
        cameraZ,
        targetX,
        1.5,
        targetZ,
        true // Enable smooth transition
    )
}