import * as THREE from 'three';
import { BaseVehicle } from '../../entities/Vehicles/BaseVehicle';

export class TrafficManager {
    constructor(scene, physicsWorld, zoneManager, wantedManager) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.zoneManager = zoneManager;
        this.wantedManager = wantedManager;

        this.vehicles = [];
        this.maxVehicles = 10;
        this.spawnTimer = 0;
        this.spawnInterval = 2000; // ms

        this.onVehicleSpawn = null;
        this.onVehicleDespawn = null;
    }

    update(playerPosition, delta) {
        this.spawnTimer += delta * 1000;

        if (this.spawnTimer > this.spawnInterval && this.vehicles.length < this.maxVehicles) {
            this.spawnVehicleNear(playerPosition);
            this.spawnTimer = 0;
        }

        // AI Logic for existing vehicles
        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            const v = this.vehicles[i];
            v.update();

            // Simple "go forward" behavior
            v.applyMovement(1000, 0, 0);

            // Despawn if too far
            const dist = playerPosition.distanceTo(v.chassisBody.position);
            if (dist > 300) {
                this.despawnVehicle(i);
            }
        }
    }

    spawnVehicleNear(playerPosition) {
        // Random offset
        const x = playerPosition.x + (Math.random() - 0.5) * 200;
        const z = playerPosition.z + (Math.random() - 0.5) * 200;

        const isPolice = this.wantedManager && this.wantedManager.getLevel() > 0 && Math.random() < 0.3;
        const vehicle = new BaseVehicle(this.scene, this.physicsWorld, { x, y: 1, z });

        if (isPolice) {
            vehicle.mesh.material.color.set(0x0000ff); // Police blue
            // Add siren lights mock
            const siren = new THREE.PointLight(0xff0000, 10, 10);
            siren.position.set(0, 1.5, 0);
            vehicle.mesh.add(siren);
        }

        this.vehicles.push(vehicle);
        if (this.onVehicleSpawn) this.onVehicleSpawn(vehicle);
    }

    despawnVehicle(index) {
        const vehicle = this.vehicles[index];
        if (this.onVehicleDespawn) this.onVehicleDespawn(vehicle);
        vehicle.dispose();
        this.vehicles.splice(index, 1);
    }
}
