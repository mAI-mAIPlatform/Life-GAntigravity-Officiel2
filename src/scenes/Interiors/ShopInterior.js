import * as THREE from 'three';
import { BaseScene } from '../BaseScene';

export class ShopInterior extends BaseScene {
    constructor(engine, physics, shopData, economyManager) {
        super(engine, physics);
        this.shopData = shopData;
        this.economyManager = economyManager;
    }

    init() {
        this.scene.background = new THREE.Color(0x0a0a12);
        this.scene.fog = new THREE.FogExp2(0x0a0a12, 0.05);

        // 1. Room Construction
        const roomGeo = new THREE.BoxGeometry(15, 6, 15);
        const roomMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            side: THREE.BackSide,
            roughness: 0.8,
            metalness: 0.2
        });
        const room = new THREE.Mesh(roomGeo, roomMat);
        room.position.y = 3;
        this.scene.add(room);

        // Floor - Polished concrete / obsidian look
        const floorGeo = new THREE.PlaneGeometry(15, 15);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.9 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // 2. Lighting
        const accentColor = this.getAccentColor();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Neon ceiling strips
        const neonGeo = new THREE.BoxGeometry(0.2, 0.05, 10);
        const neonMat = new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 5 });

        for (let i = 0; i < 3; i++) {
            const strip = new THREE.Mesh(neonGeo, neonMat);
            strip.position.set(-4 + i * 4, 5.95, 0);
            this.scene.add(strip);

            const areaLight = new THREE.RectAreaLight(accentColor, 2, 0.2, 10);
            areaLight.position.set(-4 + i * 4, 5.9, 0);
            areaLight.lookAt(-4 + i * 4, 0, 0);
            this.scene.add(areaLight);
        }

        // 3. Props based on shop type
        this.setupShopProps(accentColor);

        // 4. Counter and Interactive Point
        this.setupCounter();

        // 5. Camera Setup
        this.engine.camera.position.set(0, 1.6, 6);
        this.engine.camera.lookAt(0, 1.2, 0);
        this.engine.camera.fov = 75;
        this.engine.camera.updateProjectionMatrix();

        console.log(`Interior loaded for: ${this.shopData.name}`);
    }

    getAccentColor() {
        switch (this.shopData.type) {
            case 'weapon': return 0xff3333;
            case 'clothing': return 0x3333ff;
            case 'supermarket': return 0x33ff33;
            case 'dealership': return 0x33ffff;
            case 'club': return 0xff33ff;
            default: return 0x00ffff;
        }
    }

    setupShopProps(color) {
        if (this.shopData.type === 'weapon') {
            // Weapon racks on walls
            const rackGeo = new THREE.BoxGeometry(4, 3, 0.2);
            const rackMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
            const rack = new THREE.Mesh(rackGeo, rackMat);
            rack.position.set(-5, 2.5, -7.4);
            this.scene.add(rack);

            // Placeholder guns
            for (let i = 0; i < 3; i++) {
                const gun = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.1), new THREE.MeshStandardMaterial({ color }));
                gun.position.set(-6 + i * 1, 3, -7.2);
                this.scene.add(gun);
            }
        }
    }

    setupCounter() {
        const counterGeo = new THREE.BoxGeometry(4, 1.1, 1.2);
        const counterMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0, metalness: 1 });
        const counter = new THREE.Mesh(counterGeo, counterMat);
        counter.position.set(0, 0.55, -3);
        this.scene.add(counter);

        // Glass top
        const glassGeo = new THREE.BoxGeometry(4.1, 0.05, 1.3);
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            roughness: 0
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.set(0, 1.1, -3);
        this.scene.add(glass);
    }

    update() {
        super.update();
    }
}
