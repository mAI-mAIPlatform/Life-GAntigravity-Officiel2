import * as THREE from 'three';
import { Pedestrian } from '../../entities/NPCs/Pedestrian';

export class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.pedestrians = [];
        this.maxPedestrians = 30;
        this.spawnRadius = 150;
        this.despawnRadius = 200;

        this.colors = [0x5555ff, 0xff5555, 0x55ff55, 0xffff55, 0xff55ff, 0x55ffff, 0xffffff];

        this.onNPCSpawn = null;
        this.onNPCDespawn = null;
    }

    update(playerPosition, delta) {
        // 1. Spawn logic
        if (this.pedestrians.length < this.maxPedestrians) {
            this.spawnPedestrianNear(playerPosition);
        }

        // 2. Update and Despawn logic
        for (let i = this.pedestrians.length - 1; i >= 0; i--) {
            const p = this.pedestrians[i];
            p.update(delta);

            const distance = playerPosition.distanceTo(p.position);

            // If too far, despawn
            if (distance > this.despawnRadius) {
                this.despawnPedestrian(i);
            }
        }
    }

    spawnPedestrianNear(playerPosition) {
        // Spawn at random position within radius but outside a minimum distance (to not pop in in front of player)
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * (this.spawnRadius - 50);

        const x = playerPosition.x + Math.cos(angle) * radius;
        const z = playerPosition.z + Math.sin(angle) * radius;

        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const pedestrian = new Pedestrian(this.scene, { x, y: 0, z }, color);
        this.pedestrians.push(pedestrian);
        if (this.onNPCSpawn) this.onNPCSpawn(pedestrian);
    }

    despawnPedestrian(index) {
        const p = this.pedestrians[index];
        if (this.onNPCDespawn) this.onNPCDespawn(p);
        p.dispose();
        this.pedestrians.splice(index, 1);
    }

    getInProximity(pos, radius = 3) {
        return this.pedestrians.find(p => p.position.distanceTo(pos) < radius);
    }
}
