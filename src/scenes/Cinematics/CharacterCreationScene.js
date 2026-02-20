import * as THREE from 'three';
import { BaseScene } from '../BaseScene';
import { CharacterData } from '../../entities/NPCs/Humanoids/CharacterData';

export class CharacterCreationScene extends BaseScene {
    constructor(engine, physics) {
        super(engine, physics);
        this.characterData = new CharacterData();
        this.avatarMesh = null;
    }

    init() {
        // Setup Studio Lighting
        this.scene.background = new THREE.Color('#1a1a24');

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = true;
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x90b0d0, 0.5);
        fillLight.position.set(-5, 3, 5);
        this.scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0xd0b090, 0.8);
        backLight.position.set(0, 5, -5);
        this.scene.add(backLight);

        // Setup Studio Backdrop
        const backdropGeo = new THREE.CylinderGeometry(10, 10, 10, 32, 1, true, 0, Math.PI);
        const backdropMat = new THREE.MeshStandardMaterial({
            color: 0x2a2a35,
            side: THREE.BackSide,
            roughness: 0.9
        });
        const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
        backdrop.position.y = 5;
        this.scene.add(backdrop);

        // Pedestal
        const pedGeo = new THREE.CylinderGeometry(2, 2.2, 0.2, 32);
        const pedMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.5, metalness: 0.8 });
        const pedestal = new THREE.Mesh(pedGeo, pedMat);
        pedestal.position.y = -0.1;
        pedestal.receiveShadow = true;
        this.scene.add(pedestal);

        // Place Camera
        this.engine.camera.position.set(0, 1.5, 4);
        this.engine.camera.lookAt(0, 1, 0);

        // Create Placeholder Avatar
        this.createAvatar();

        // Bind Data Changes
        this.characterData.on('appearance_changed', (data) => this.updateAvatarVisually(data));
    }

    createAvatar() {
        // Placeholder for a real GLTF model
        const geo = new THREE.CapsuleGeometry(0.3, 1.2, 4, 16);
        const mat = new THREE.MeshStandardMaterial({
            color: this.characterData.appearance.skinColor,
            roughness: 0.4
        });
        this.avatarMesh = new THREE.Mesh(geo, mat);
        this.avatarMesh.position.y = 0.9; // Half height + offset
        this.avatarMesh.castShadow = true;
        this.scene.add(this.avatarMesh);

        // Temporary Head
        const headGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const headMat = new THREE.MeshStandardMaterial({ color: this.characterData.appearance.skinColor });
        this.headMesh = new THREE.Mesh(headGeo, headMat);
        this.headMesh.position.y = 1.8;
        this.scene.add(this.headMesh);
    }

    updateAvatarVisually(data) {
        if (!this.avatarMesh) return;

        if (data.key === 'skinColor') {
            this.avatarMesh.material.color.set(data.value);
            this.headMesh.material.color.set(data.value);
        }
        if (data.key === 'height') {
            const scale = data.value / 1.75; // 1.75 is default base height
            this.avatarMesh.scale.set(1, scale, 1);
            this.avatarMesh.position.y = (1.2 * scale) / 2 + 0.3;
            this.headMesh.position.y = 1.8 * scale;
        }
        if (data.key === 'jawWidth') {
            this.headMesh.scale.set(0.5 + data.value, 1, 1);
        }
    }

    update() {
        super.update();
        // Slow rotation for presentation
        if (this.avatarMesh && this.headMesh) {
            // this.avatarMesh.rotation.y += 0.005;
            // this.headMesh.rotation.y += 0.005;
        }
    }
}
