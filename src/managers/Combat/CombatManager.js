import * as THREE from 'three';

export class CombatManager {
    constructor(scene, camera, player, input) {
        this.scene = scene;
        this.camera = camera;
        this.player = player;
        this.input = input;

        this.raycaster = new THREE.Raycaster();
        this.crosshair = this.createCrosshair();

        this.ammo = 30;
        this.maxAmmo = 30;
        this.isReloading = false;

        this.fireRate = 150; // ms
        this.lastShotTime = 0;

        this.onHit = null; // Callback for damage
    }

    createCrosshair() {
        const el = document.createElement('div');
        el.id = 'combat-crosshair';
        el.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-white/50 rounded-full flex items-center justify-center pointer-events-none z-[1000] hidden';
        el.innerHTML = '<div class="w-1 h-1 bg-red-500 rounded-full"></div>';
        document.body.appendChild(el);
        return el;
    }

    update() {
        if (!this.player || this.player.isInsideVehicle) {
            if (this.crosshair) this.crosshair.classList.add('hidden');
            return;
        }

        // Only show crosshair if player "aims" or has weapon out
        if (this.crosshair) this.crosshair.classList.remove('hidden');

        const now = performance.now();
        if (this.input.mouse.isDown && !this.isReloading && this.ammo > 0) {
            if (now - this.lastShotTime > this.fireRate) {
                this.shoot();
                this.lastShotTime = now;
            }
        }
    }

    shoot() {
        if (this.ammo <= 0) return;

        this.ammo--;
        this.applyRecoil();
        this.createMuzzleFlash();

        // Raycast from center of screen
        this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);

        // Find intersections with NPCs or vehicles
        const targets = this.scene.children.filter(obj => obj !== this.player.mesh);
        const intersects = this.raycaster.intersectObjects(targets, true);

        if (intersects.length > 0) {
            const hit = intersects[0];
            this.handleHit(hit);
        }

        // Automatic reload for demo
        if (this.ammo === 0) this.reload();
    }

    handleHit(hit) {
        console.log("Hit object:", hit.object.name || hit.object.type);

        // Create hit effect
        this.createHitEffect(hit.point, hit.face.normal);

        if (this.onHit) {
            this.onHit(hit.object, hit.point);
        }
    }

    createMuzzleFlash() {
        // Flash light or sprite logic
    }

    createHitEffect(point, normal) {
        const geo = new THREE.SphereGeometry(0.05, 4, 4);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const spark = new THREE.Mesh(geo, mat);
        spark.position.copy(point);
        this.scene.add(spark);
        setTimeout(() => this.scene.remove(spark), 100);
    }

    reload() {
        this.isReloading = true;
        setTimeout(() => {
            this.ammo = this.maxAmmo;
            this.isReloading = false;
        }, 1500);
    }

    applyRecoil() {
        // Mock recoil by slightly tilting camera or mesh
    }
}
