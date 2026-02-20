import * as THREE from 'three';

export class StreetProps {
    constructor(scene) {
        this.scene = scene;
        // In a real scenario, this would load GLTFs via AssetLoader.
        // For now, we generate basic meshes to validate the architecture.
    }

    createStreetLamp(x, z) {
        const group = new THREE.Group();

        // Pole
        const poleGeo = new THREE.CylinderGeometry(0.1, 0.15, 6, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 3;
        group.add(pole);

        // Light emissive
        const lightGeo = new THREE.BoxGeometry(1, 0.2, 0.5);
        const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaccff, emissiveIntensity: 2 });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.set(0.4, 6, 0);
        group.add(light);

        // Actual PointLight
        const pointLight = new THREE.PointLight(0xaaccff, 1, 20);
        pointLight.position.set(0.4, 5.8, 0);
        // pointLight.castShadow = true; // Optimization: Too many shadows
        group.add(pointLight);

        group.position.set(x, 0, z);
        this.scene.add(group);
        return group;
    }

    createVendingMachine(x, z, rotY = 0) {
        const geo = new THREE.BoxGeometry(1.5, 2.5, 1);

        // Front face is emissive for the screen/buttons
        const matBody = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const matScreen = new THREE.MeshStandardMaterial({ color: 0xff5555, emissive: 0xff2222, emissiveIntensity: 1 });

        const machine = new THREE.Mesh(geo, [matBody, matBody, matBody, matBody, matScreen, matBody]);
        machine.position.set(x, 1.25, z);
        machine.rotation.y = rotY;

        this.scene.add(machine);
        return machine;
    }

    generateForChunk(cx, cz, size, districtType) {
        const props = [];
        const numLamps = districtType === 'downtown' ? 4 : 2;

        for (let i = 0; i < numLamps; i++) {
            props.push(this.createStreetLamp(
                cx + Math.random() * size,
                cz + Math.random() * size
            ));
        }

        if (Math.random() > 0.5) {
            props.push(this.createVendingMachine(
                cx + Math.random() * size,
                cz + Math.random() * size,
                Math.random() * Math.PI
            ));
        }

        return props; // Can be used by ZoneManager to remove them later
    }
}
