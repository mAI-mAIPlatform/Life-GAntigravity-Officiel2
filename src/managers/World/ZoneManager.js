import * as THREE from 'three';

export class ZoneManager {
    constructor(scene, physics, buildingGenerator, chunkSize = 100) {
        this.scene = scene;
        this.physics = physics;
        this.buildingGenerator = buildingGenerator;
        this.chunkSize = chunkSize; // Size of a square zone in meters

        this.activeChunks = new Map(); // key 'x,z' -> chunk object
        this.currentChunkKeys = new Set();
        this.renderDistance = 2; // Chunks around the player

        // Factory map to instantiate districts
        this.chunkFactories = new Map();
    }

    registerDistrictFactory(name, factoryCallback) {
        this.chunkFactories.set(name, factoryCallback);
    }

    update(playerPosition) {
        // Calculate current player chunk coordinates
        const playerChunkX = Math.floor(playerPosition.x / this.chunkSize);
        const playerChunkZ = Math.floor(playerPosition.z / this.chunkSize);

        const newKeys = new Set();

        // Determine which chunks should be active
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                const cx = playerChunkX + x;
                const cz = playerChunkZ + z;

                // Keep it circular-ish for optimization instead of square
                if (x * x + z * z <= this.renderDistance * this.renderDistance) {
                    newKeys.add(`${cx},${cz}`);
                }
            }
        }

        // Unload chunks that are out of bounds
        for (const [key, chunk] of this.activeChunks.entries()) {
            if (!newKeys.has(key)) {
                this.unloadChunk(key, chunk);
                this.activeChunks.delete(key);
            }
        }

        // Load new chunks
        for (const key of newKeys) {
            if (!this.activeChunks.has(key)) {
                const [cx, cz] = key.split(',').map(Number);
                const chunk = this.loadChunk(cx, cz);
                if (chunk) {
                    this.activeChunks.set(key, chunk);
                }
            }
        }

        // Check if chunks actually changed to avoid redundant building generator updates
        let changed = false;
        if (newKeys.size !== this.currentChunkKeys.size) {
            changed = true;
        } else {
            for (const key of newKeys) {
                if (!this.currentChunkKeys.has(key)) {
                    changed = true;
                    break;
                }
            }
        }

        if (changed) {
            // Collect all active building transforms for the generator
            const activeTransforms = [];
            for (const chunk of this.activeChunks.values()) {
                if (chunk.buildingTransforms) {
                    activeTransforms.push(...chunk.buildingTransforms);
                }
            }

            // Render all instances
            if (this.buildingGenerator) {
                this.buildingGenerator.render(activeTransforms);
            }
        }

        // Always call update on chunks (for animations/AI)
        for (const chunk of this.activeChunks.values()) {
            if (chunk.update) chunk.update();
        }

        this.currentChunkKeys = newKeys;
    }

    loadChunk(cx, cz) {
        // Determine district type based on coordinates (mock generation)
        let districtType = 'slums';
        if (Math.abs(cx) < 2 && Math.abs(cz) < 2) {
            districtType = 'downtown';
        } else if (Math.abs(cx) > 3) {
            districtType = 'commercial';
        }

        const factory = this.chunkFactories.get(districtType);

        if (factory) {
            const chunk = factory(cx * this.chunkSize, cz * this.chunkSize, this.chunkSize, this.buildingGenerator, this.physics);

            // Add meshes and bodies to world
            if (chunk.meshes) chunk.meshes.forEach(mesh => this.scene.add(mesh));
            if (chunk.bodies) chunk.bodies.forEach(body => this.physics.addBody(body));

            return chunk;
        }
        return null;
    }

    unloadChunk(key, chunk) {
        // Clean up three.js resources
        chunk.meshes.forEach(mesh => {
            this.scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(m => m.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
        });

        // Clean up physics
        chunk.bodies.forEach(body => {
            this.physics.removeBody(body);
        });
    }

    dispose() {
        for (const [key, chunk] of this.activeChunks.entries()) {
            this.unloadChunk(key, chunk);
        }
        this.activeChunks.clear();
    }
}
