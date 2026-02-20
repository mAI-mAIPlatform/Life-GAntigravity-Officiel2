import * as THREE from 'three';

export class Pedestrian {
    constructor(scene, position = { x: 0, y: 0, z: 0 }, color = 0xcccccc) {
        this.scene = scene;
        this.position = new THREE.Vector3(position.x, position.y, position.z);

        this.mesh = null;
        this.state = 'WANDER'; // WANDER, IDLE, TALKING

        this.speed = 2 + Math.random() * 2;
        this.direction = new THREE.Vector3(
            Math.random() - 0.5,
            0,
            Math.random() - 0.5
        ).normalize();

        this.targetRotation = Math.atan2(this.direction.x, this.direction.z);
        this.currentRotation = this.targetRotation;

        this.health = 100;

        this.init(color);
    }

    init(color) {
        // Simple humanoid placeholder: Cylinder body + Sphere head
        const group = new THREE.Group();

        const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xeebb99 }); // Skin tone
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.4;
        head.castShadow = true;
        group.add(head);

        // Eyes (to see direction)
        const eyeGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.1, 1.45, 0.15);
        group.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.1, 1.45, 0.15);
        group.add(rightEye);

        this.mesh = group;
        this.mesh.position.copy(this.position);
        this.mesh.rotation.y = this.currentRotation;
        this.scene.add(this.mesh);
    }

    update(delta) {
        if (this.state === 'IDLE' || this.state === 'TALKING') return;

        // Simple Wander AI
        if (Math.random() < 0.01) {
            // Change direction occasionally
            this.direction.set(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
            this.targetRotation = Math.atan2(this.direction.x, this.direction.z);
        }

        // Apply movement
        const moveStep = this.direction.clone().multiplyScalar(this.speed * delta);
        this.mesh.position.add(moveStep);
        this.position.copy(this.mesh.position);

        // Smooth rotation
        this.currentRotation = THREE.MathUtils.lerp(this.currentRotation, this.targetRotation, 0.1);
        this.mesh.rotation.y = this.currentRotation;

        // Keep on ground (Y=0 for sidewalks)
        this.mesh.position.y = 0;
    }

    setTalking(bool) {
        this.state = bool ? 'TALKING' : 'WANDER';
    }

    dispose() {
        this.scene.remove(this.mesh);
        this.mesh.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }
}
