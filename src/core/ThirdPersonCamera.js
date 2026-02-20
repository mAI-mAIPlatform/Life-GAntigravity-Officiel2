import * as THREE from 'three';

export class ThirdPersonCamera {
    constructor(camera, target, input) {
        this.camera = camera;
        this.target = target; // The Player object
        this.input = input;

        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();

        this.idealOffset = new THREE.Vector3(-0.5, 3, 6);
        this.idealLookat = new THREE.Vector3(0, 1.5, -5);

        this.phi = 0;
        this.theta = 0;

        this.sensitivity = 0.002;
        this.fovTarget = 75;
        this.currentFov = 75;
    }

    setTarget(target, isVehicle = false) {
        this.target = target;
        if (isVehicle) {
            this.idealOffset.set(-1, 5, 10);
            this.idealLookat.set(0, 1, -5);
            this.fovTarget = 85;
        } else {
            this.idealOffset.set(-0.5, 3, 6);
            this.idealLookat.set(0, 1.5, -5);
            this.fovTarget = 75;
        }
    }

    calculateIdealOffset() {
        const idealOffset = this.idealOffset.clone();
        idealOffset.applyQuaternion(this.getRotation());
        const targetPos = this.target.getPosition ? this.target.getPosition() : this.target.position;
        idealOffset.add(targetPos);
        return idealOffset;
    }

    calculateIdealLookat() {
        const idealLookat = this.idealLookat.clone();
        idealLookat.applyQuaternion(this.getRotation());
        const targetPos = this.target.getPosition ? this.target.getPosition() : this.target.position;
        idealLookat.add(targetPos);
        return idealLookat;
    }

    getRotation() {
        const q = new THREE.Quaternion();
        q.setFromEuler(new THREE.Euler(this.phi, this.theta, 0, 'YXZ'));
        return q;
    }

    update(timeElapsed) {
        if (!this.target) return;

        // Update rotation based on mouse movement
        this.theta -= this.input.mouse.dx * this.sensitivity;
        this.phi -= this.input.mouse.dy * this.sensitivity;

        // Clamp phi (vertical rotation)
        this.phi = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.phi));

        const idealOffset = this.calculateIdealOffset();
        const idealLookat = this.calculateIdealLookat();

        // Smooth camera movement (Interpolation)
        const t = 1.0 - Math.pow(0.001, timeElapsed);

        this.currentPosition.lerp(idealOffset, t);
        this.currentLookat.lerp(idealLookat, t);

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookat);

        // Smooth FOV transition
        this.currentFov = THREE.MathUtils.lerp(this.currentFov, this.fovTarget, t);
        this.camera.fov = this.currentFov;
        this.camera.updateProjectionMatrix();
    }
}
