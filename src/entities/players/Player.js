import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Player {
    constructor(scene, physicsWorld, input) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.input = input;

        this.mesh = null;
        this.body = null;

        this.speed = 8;
        this.sprintMultiplier = 1.8;
        this.jumpForce = 5;
        this.height = 1.8;
        this.radius = 0.4;

        this.health = 100;
        this.isInsideVehicle = false;

        this.init();
    }

    init() {
        // 1. Physics Body (Capsule replacement using Cylinder for simplicity)
        const shape = new CANNON.Cylinder(this.radius, this.radius, this.height, 12);
        this.body = new CANNON.Body({
            mass: 80, // kg
            shape: shape,
            material: new CANNON.Material({ friction: 0.1, restitution: 0 })
        });

        // Prevent player from tipping over
        this.body.fixedRotation = true;
        this.body.updateMassProperties();
        this.body.position.set(0, 5, 0); // Start slightly in air

        this.physicsWorld.addBody(this.body);

        // 2. Visual Representation (Placeholder)
        const geometry = new THREE.CapsuleGeometry(this.radius, this.height - this.radius * 2, 4, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x2244ff,
            roughness: 0.5,
            metalness: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }

    update(camera) {
        if (!this.body || !this.mesh) return;

        // Sync Mesh with Body
        this.mesh.position.copy(this.body.position);

        // Movement logic
        this.handleMovement(camera);
    }

    handleMovement(camera) {
        const forward = this.input.isKeyDown('KeyW');
        const backward = this.input.isKeyDown('KeyS');
        const left = this.input.isKeyDown('KeyA');
        const right = this.input.isKeyDown('KeyD');
        const sprint = this.input.isKeyDown('ShiftLeft');
        const jump = this.input.isKeyDown('Space');

        // Direction vector based on camera rotation
        const direction = new THREE.Vector3();

        // Get camera forward direction (projected on XZ plane)
        const cameraForward = new THREE.Vector3(0, 0, -1);
        cameraForward.applyQuaternion(camera.quaternion);
        cameraForward.y = 0;
        cameraForward.normalize();

        const cameraRight = new THREE.Vector3(1, 0, 0);
        cameraRight.applyQuaternion(camera.quaternion);
        cameraRight.y = 0;
        cameraRight.normalize();

        if (forward) direction.add(cameraForward);
        if (backward) direction.sub(cameraForward);
        if (left) direction.sub(cameraRight);
        if (right) direction.add(cameraRight);

        if (direction.length() > 0) {
            direction.normalize();
        }

        const currentSpeed = sprint ? this.speed * this.sprintMultiplier : this.speed;

        // Apply velocity to physics body (keeping vertical velocity for gravity/jumping)
        this.body.velocity.x = direction.x * currentSpeed;
        this.body.velocity.z = direction.z * currentSpeed;

        // Basic Jump logic (ground check via velocity for now)
        if (jump && Math.abs(this.body.velocity.y) < 0.1) {
            this.body.velocity.y = this.jumpForce;
        }

        // Rotate mesh to face movement direction if moving
        if (direction.length() > 0.1) {
            const targetRotation = Math.atan2(direction.x, direction.z);
            this.mesh.rotation.y = targetRotation;
        }
    }

    getPosition() {
        return this.body.position;
    }
}
