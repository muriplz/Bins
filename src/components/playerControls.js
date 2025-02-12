import { reactive } from 'vue';
import * as THREE from 'three';

const positionData = reactive({ x: 0, y: 0, z: 0 });
const position = new THREE.Vector3(0, 0, 0);
const velocity = reactive(new THREE.Vector3(0, 0, 0));
const acceleration = 0.01;
const maxSpeed = 0.2;
const keys = {};

function handleKeyDown(event) {
    keys[event.key.toLowerCase()] = true;
}

function handleKeyUp(event) {
    keys[event.key.toLowerCase()] = false;
}

function updatePosition() {
    if (keys['w']) {
        velocity.z = Math.max(velocity.z - acceleration, -maxSpeed);
    } else if (keys['s']) {
        velocity.z = Math.min(velocity.z + acceleration, maxSpeed);
    } else {
        velocity.z = THREE.MathUtils.lerp(velocity.z, 0, 0.1);
    }

    if (keys['a']) {
        velocity.x = Math.max(velocity.x - acceleration, -maxSpeed);
    } else if (keys['d']) {
        velocity.x = Math.min(velocity.x + acceleration, maxSpeed);
    } else {
        velocity.x = THREE.MathUtils.lerp(velocity.x, 0, 0.1);
    }

    positionData.x += velocity.x;
    positionData.z += velocity.z;
    position.copy(positionData);

    requestAnimationFrame(updatePosition);
}

function setupControls() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    updatePosition();
}

function removeControls() {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
}

export { position, positionData, setupControls, removeControls };