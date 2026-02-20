import * as THREE from 'three';

export class VehicleDriveController {
    constructor(input) {
        this.input = input;
        this.vehicle = null;
        this.isActive = false;

        this.maxEngineForce = 2500;
        this.maxSteeringVal = 0.5;
        this.brakeForce = 100;
    }

    attach(vehicle) {
        this.vehicle = vehicle;
        this.isActive = true;
    }

    detach() {
        if (this.vehicle) {
            this.vehicle.applyMovement(0, 0, 100); // Stop vehicle on exit
        }
        this.vehicle = null;
        this.isActive = false;
    }

    update() {
        if (!this.isActive || !this.vehicle) return;

        const forward = this.input.isKeyDown('KeyW') || this.input.isKeyDown('ArrowUp');
        const backward = this.input.isKeyDown('KeyS') || this.input.isKeyDown('ArrowDown');
        const left = this.input.isKeyDown('KeyA') || this.input.isKeyDown('ArrowLeft');
        const right = this.input.isKeyDown('KeyD') || this.input.isKeyDown('ArrowRight');
        const brake = this.input.isKeyDown('Space');

        let engineForce = 0;
        let steeringValue = 0;
        let currentBrake = 0;

        if (forward) engineForce = -this.maxEngineForce;
        if (backward) engineForce = this.maxEngineForce;

        if (left) steeringValue = this.maxSteeringVal;
        if (right) steeringValue = -this.maxSteeringVal;

        if (brake) currentBrake = this.brakeForce;

        this.vehicle.applyMovement(engineForce, steeringValue, currentBrake);
    }
}
