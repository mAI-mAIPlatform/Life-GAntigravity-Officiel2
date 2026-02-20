import * as THREE from 'three';
import { BaseScene } from './BaseScene';
import { PhysicsObjects } from '../physics/objects';

export class MainScene extends BaseScene {
    constructor(engine, physics) {
        super(engine, physics);
    }

    init() {
        // Add Grid Helper
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
        this.scene.add(gridHelper);

        // Add Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Add Ground
        const groundSize = 50;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.2
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        // Physics Ground
        const groundBody = PhysicsObjects.createPlane();
        this.physics.addBody(groundBody);

        // Add multiple falling cubes to demonstrate large scale preparation
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createCube(
                    (Math.random() - 0.5) * 4,
                    10 + (i * 2),
                    (Math.random() - 0.5) * 4
                );
            }, i * 500);
        }
    }

    createCube(x = 0, y = 5, z = 0) {
        const size = 1;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
            roughness: 0.3,
            metalness: 0.4
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        this.scene.add(mesh);

        const body = PhysicsObjects.createBox(size, size, size, 1, { x, y, z });

        // Add random angular velocity for more dynamic bounce
        body.angularVelocity.set(
            Math.random() * 5,
            Math.random() * 5,
            Math.random() * 5
        );

        this.physics.addBody(body);

        this.entities.push({
            update: () => {
                mesh.position.copy(body.position);
                mesh.quaternion.copy(body.quaternion);
            }
        });
    }

    update() {
        super.update();
    }
}
