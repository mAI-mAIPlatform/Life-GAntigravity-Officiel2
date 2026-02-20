import * as THREE from 'three';

export class BuildingGenerator {
    constructor(scene, count) {
        this.scene = scene;
        this.count = count;

        // Use InstancedMesh for extreme optimization
        // Assume 3 generic building types (tall glass, medium concrete, small brick)
        const geometries = [
            new THREE.BoxGeometry(20, 100, 20),
            new THREE.BoxGeometry(15, 40, 15),
            new THREE.BoxGeometry(10, 20, 10)
        ];

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0x11111a, roughness: 0.1, metalness: 0.9 }), // Glass
            new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.3 }), // Concrete
            new THREE.MeshStandardMaterial({ color: 0x442222, roughness: 0.9, metalness: 0.1 })  // Brick
        ];

        this.instancedMeshes = [];
        for (let i = 0; i < 3; i++) {
            const im = new THREE.InstancedMesh(geometries[i], materials[i], count);
            im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            im.count = 0; // Start at 0, filled dynamically
            //im.castShadow = true; // Too expensive for far background
            im.receiveShadow = true;
            this.scene.add(im);
            this.instancedMeshes.push(im);
        }

        this.dummy = new THREE.Object3D();
        this.activeTransforms = [];
    }

    generate(districtType, cx, cz, size) {
        // Return mesh data or indices that the ZoneManager can activate/deactivate
        // For simplicity in this demo architecture, we'll return an array of transforms
        const transforms = [];

        // Rules based on district
        let typeDist = [0.1, 0.4, 0.5]; // default mixed
        let density = 5;
        let scaleVar = 1.0;

        if (districtType === 'downtown') {
            typeDist = [0.7, 0.3, 0.0]; // mostly tall glass
            density = 8;
            scaleVar = 2.0;
        } else if (districtType === 'slums') {
            typeDist = [0.0, 0.2, 0.8]; // mostly small/medium
            density = 15;
            scaleVar = 0.5;
        } else if (districtType === 'commercial') {
            typeDist = [0.2, 0.6, 0.2]; // mostly mediums
            density = 6;
            scaleVar = 1.2;
        }

        for (let i = 0; i < density; i++) {
            // Position within chunk
            const x = cx + (Math.random() * size);
            const z = cz + (Math.random() * size);

            // Choose type based on distribution
            const r = Math.random();
            let typeIdx = 0;
            if (r > typeDist[0]) typeIdx = 1;
            if (r > typeDist[0] + typeDist[1]) typeIdx = 2;

            const scale = 1.0 + (Math.random() * scaleVar);
            const rotY = Math.random() * Math.PI * 2;

            const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.2 + Math.random() * 0.1);
            transforms.push({ typeIdx, position: new THREE.Vector3(x, 0, z), scale, rotY, color });
        }

        return transforms;
    }

    render(activeTransforms) {
        // Reset counts
        this.instancedMeshes.forEach(im => im.count = 0);

        // Apply transforms to instanced meshes
        activeTransforms.forEach(t => {
            const im = this.instancedMeshes[t.typeIdx];
            if (im.count >= this.count) return; // Prevent overflow

            this.dummy.position.copy(t.position);

            // Assume pivot is at center for BoxGeometry, so raise by half height * scale
            const heights = [100, 40, 20];
            this.dummy.position.y = (heights[t.typeIdx] * t.scale) / 2;

            this.dummy.scale.set(1, t.scale, 1);
            this.dummy.rotation.set(0, t.rotY, 0);
            this.dummy.updateMatrix();

            im.setMatrixAt(im.count, this.dummy.matrix);

            im.setColorAt(im.count, t.color);

            im.count++;
        });

        // Notify three.js to update buffers
        this.instancedMeshes.forEach(im => {
            im.instanceMatrix.needsUpdate = true;
            if (im.instanceColor) im.instanceColor.needsUpdate = true;
        });
    }

    dispose() {
        this.instancedMeshes.forEach(im => {
            this.scene.remove(im);
            im.dispose();
            im.geometry.dispose();
            im.material.dispose();
        });
        this.instancedMeshes = [];
    }
}
