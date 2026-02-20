import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class BaseVehicle {
    constructor(scene, physicsWorld, position = { x: 0, y: 1, z: 0 }) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;

        this.mesh = null;
        this.chassisBody = null;
        this.vehicle = null;
        this.health = 500;

        this.init(position);
    }

    init(position) {
        // 1. Chassis
        const chassisShape = new CANNON.Box(new CANNON.Vec3(1.2, 0.5, 2.5));
        this.chassisBody = new CANNON.Body({ mass: 1500 });
        this.chassisBody.addShape(chassisShape);
        this.chassisBody.position.set(position.x, position.y + 1, position.z);
        this.chassisBody.angularVelocity.set(0, 0, 0);

        // 2. Vehicle Controller (RaycastVehicle)
        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody,
            indexForwardAxis: 2,
            indexRightAxis: 0,
            indexUpAxis: 1
        });

        // 3. Wheels settings
        const wheelOptions = {
            radius: 0.4,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 30,
            suspensionRestLength: 0.3,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true
        };

        // Add 4 wheels
        const wheelY = -0.3;
        const wheelX = 0.8;
        const wheelZ = 1.5;

        wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, wheelZ);
        this.vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, wheelZ);
        this.vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, -wheelZ);
        this.vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, -wheelZ);
        this.vehicle.addWheel(wheelOptions);

        this.vehicle.addToWorld(this.physicsWorld.world);
        this.physicsWorld.addBody(this.chassisBody);

        // 4. Visual Mesh (Placeholder Cyber-Car)
        const geometry = new THREE.BoxGeometry(2.4, 1, 5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.1,
            metalness: 0.9
        });
        this.mesh = new THREE.Mesh(geometry, material);

        // Add "lights" mesh
        const lightGeo = new THREE.BoxGeometry(2.2, 0.1, 0.1);
        const lightMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
        const frontLight = new THREE.Mesh(lightGeo, lightMat);
        frontLight.position.set(0, 0.2, 2.5);
        this.mesh.add(frontLight);

        this.scene.add(this.mesh);

        // Visual wheels
        this.wheelMeshes = [];
        const wGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
        const wMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        wGeo.rotateZ(Math.PI / 2);

        for (let i = 0; i < 4; i++) {
            const wMesh = new THREE.Mesh(wGeo, wMat);
            this.scene.add(wMesh);
            this.wheelMeshes.push(wMesh);
        }
    }

    update() {
        // Sync chassis mesh
        this.mesh.position.copy(this.chassisBody.position);
        this.mesh.quaternion.copy(this.chassisBody.quaternion);

        // Sync visual wheels
        for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
            this.vehicle.updateWheelTransform(i);
            const t = this.vehicle.wheelInfos[i].worldTransform;
            this.wheelMeshes[i].position.copy(t.position);
            this.wheelMeshes[i].quaternion.copy(t.quaternion);
        }
    }

    applyMovement(engineForce, steeringValue, brakeForce) {
        this.vehicle.applyEngineForce(engineForce, 2);
        this.vehicle.applyEngineForce(engineForce, 3);

        this.vehicle.setSteeringValue(steeringValue, 0);
        this.vehicle.setSteeringValue(steeringValue, 1);

        this.vehicle.setBrake(brakeForce, 0);
        this.vehicle.setBrake(brakeForce, 1);
        this.vehicle.setBrake(brakeForce, 2);
        this.vehicle.setBrake(brakeForce, 3);
    }

    dispose() {
        this.scene.remove(this.mesh);
        this.wheelMeshes.forEach(wm => this.scene.remove(wm));
        this.vehicle.removeFromWorld(this.physicsWorld.world);
        this.physicsWorld.removeBody(this.chassisBody);

        // Geometries/Materials
        this.mesh.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        });
        this.wheelMeshes.forEach(wm => {
            wm.geometry.dispose();
            wm.material.dispose();
        });
    }
}
