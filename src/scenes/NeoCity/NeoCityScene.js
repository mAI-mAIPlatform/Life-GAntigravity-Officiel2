import * as THREE from 'three';
import { BaseScene } from '../BaseScene';
import { ZoneManager } from '../../managers/World/ZoneManager';
import { POIManager, POIType } from '../../managers/World/POIManager';
import { BuildingGenerator } from '../../entities/Architecture/BuildingGenerator';
import { Player } from '../../entities/players/Player';
import { ThirdPersonCamera } from '../../core/ThirdPersonCamera';
import { InteractionManager } from '../../managers/Interaction/InteractionManager';
import { TrafficManager } from '../../managers/Traffic/TrafficManager';
import { NPCManager } from '../../managers/NPC/NPCManager';
import { BaseVehicle } from '../../entities/Vehicles/BaseVehicle';
import { SceneTransitionManager } from '../../managers/World/SceneTransitionManager';
import { VehicleDriveController } from '../../managers/Vehicle/VehicleDriveController';
import { CombatManager } from '../../managers/Combat/CombatManager';
import { WantedManager } from '../../managers/Crime/WantedManager';
import { ShopInterior } from '../Interiors/ShopInterior';
import { createDowntownChunk } from './Districts/Downtown';
import { createCommercialChunk } from './Districts/Commercial';
import { createCyberSlumsChunk } from './Districts/CyberSlums';

export class NeoCityScene extends BaseScene {
    constructor(engine, physics, input, economy, missionManager) {
        super(engine, physics);
        this.input = input;
        this.economy = economy;
        this.missionManager = missionManager;

        // Setup Generator that handles thousands of meshes efficiently (2000 max for demo)
        this.buildingGenerator = new BuildingGenerator(this.scene, 2000);

        this.zoneManager = new ZoneManager(this.scene, this.physics, this.buildingGenerator, 200);
        this.poiManager = new POIManager();

        this.player = new Player(this.scene, this.physics, this.input);
        this.thirdPersonCamera = new ThirdPersonCamera(this.engine.camera, this.player, this.input);

        this.interactionManager = new InteractionManager(this.player, this.scene, this.engine.camera);
        this.wantedManager = new WantedManager(); // Initialize wantedManager before trafficManager
        this.trafficManager = new TrafficManager(this.scene, this.physics, this.zoneManager, this.wantedManager);
        this.transitionManager = new SceneTransitionManager();
        this.vehicleController = new VehicleDriveController(this.input);

        this.npcManager = new NPCManager(this.scene);
        this.combatManager = new CombatManager(this.scene, this.engine.camera, this.player, this.input);

        this.setupCombatCallbacks();
        this.setupDynamicInteractions();

        // Expose systems for interaction callbacks
        window.economyManager = this.economy;
    }

    init() {
        // Setup Atmosphere / Lighting
        this.scene.background = new THREE.Color('#050510');

        // Very dense atmospheric fog for the "Cyberpunk / Liquid Glass" look
        this.scene.fog = new THREE.FogExp2('#050510', 0.005);

        const ambientLight = new THREE.AmbientLight(0x222233, 1.0);
        this.scene.add(ambientLight);

        // Global directional light (Moon / Distant City glow)
        const dirLight = new THREE.DirectionalLight(0xaabbff, 0.5);
        dirLight.position.set(50, 100, 20);
        dirLight.castShadow = true;

        // Optimize shadows for large scale
        dirLight.shadow.camera.left = -200;
        dirLight.shadow.camera.right = 200;
        dirLight.shadow.camera.top = 200;
        dirLight.shadow.camera.bottom = -200;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 500;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        this.scene.add(dirLight);

        // Global Ground (Optimized to skip per-chunk generation for now)
        this.addGlobalGround();

        // Register actual chunk factories
        this.registerDistricts();

        // Generate massive amount of POIs for testing
        this.poiManager.generateMockPOIs(100, 1000); // 100 shops spread across 1000x1000 units

        // Load initial chunks around player
        this.zoneManager.update(this.player.getPosition());

        // Expose POIManager to window for map app mapping
        window.poiManager = this.poiManager;

        this.setupInteractions();

        // Initial traffic spawn
        this.trafficManager.spawnVehicleNear(this.player.getPosition());
    }

    setupCombatCallbacks() {
        this.combatManager.onHit = (object, point) => {
            const isDescendant = (obj, parent) => {
                let curr = obj;
                while (curr) {
                    if (curr === parent) return true;
                    curr = curr.parent;
                }
                return false;
            };

            const pedestrian = this.npcManager.pedestrians.find(p => isDescendant(object, p.mesh));
            if (pedestrian) {
                pedestrian.health -= 25;
                if (pedestrian.health <= 0) {
                    this.wantedManager.addCrime('NPC_KILL');
                    console.log("Pedestrian killed!");
                    const idx = this.npcManager.pedestrians.indexOf(pedestrian);
                    if (idx !== -1) this.npcManager.despawnPedestrian(idx);
                }
            }

            const vehicle = this.trafficManager.vehicles.find(v => isDescendant(object, v.mesh));
            if (vehicle) {
                vehicle.health -= 50;
                if (vehicle.health <= 0) {
                    this.wantedManager.addCrime('VEHICLE_THEFT');
                    console.log("Vehicle destroyed!");
                    const vIdx = this.trafficManager.vehicles.indexOf(vehicle);
                    if (vIdx !== -1) this.trafficManager.despawnVehicle(vIdx);
                }
            }
        };
    }

    setupInteractions() {
        // Mock interaction for a shop
        const pois = this.poiManager.getAllPOIs();
        pois.forEach(poi => {
            // Create a small visual anchor for the shop door interaction
            const anchorGeo = new THREE.SphereGeometry(0.5, 8, 8);
            const anchorMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false });
            const anchor = new THREE.Mesh(anchorGeo, anchorMat);
            anchor.position.set(poi.position.x, 1, poi.position.z);
            this.scene.add(anchor);

            this.interactionManager.addInteractable(
                anchor,
                poi.name,
                `Entrer dans le ${poi.type}`,
                () => this.enterShop(poi)
            );
        });

        this.interactionManager.onExitVehicle = () => this.exitVehicle();

        window.addEventListener('keydown', (e) => {
            this.interactionManager.handleInput(e.code);
        });
    }

    setupDynamicInteractions() {
        // Handle Vehicles
        this.trafficManager.onVehicleSpawn = (vehicle) => {
            this.interactionManager.addInteractable(
                vehicle.mesh,
                "Cyber-Car",
                "Conduire",
                () => this.enterVehicle(vehicle)
            );
        };

        this.trafficManager.onVehicleDespawn = (vehicle) => {
            this.interactionManager.removeInteractable(vehicle.mesh);
        };

        // Handle NPCs (could add talk/interact if needed)
        this.npcManager.onNPCSpawn = (npc) => {
            // Optionnel: ajouter une interaction avec les NPCs
        };

        this.npcManager.onNPCDespawn = (npc) => {
            // Optionnel: nettoyer
        };
    }

    enterShop(poi) {
        this.transitionManager.transitionTo(() => {
            const interior = new ShopInterior(this.engine, this.physics, poi, window.economyManager);
            interior.init();

            // Mock: replacing currentScene would be cleaner via App, 
            // but for now we'll just log and let the UI open
            if (window.shopUI) window.shopUI.open(poi);
        });
    }

    enterVehicle(vehicle) {
        this.player.isInsideVehicle = true;
        this.player.mesh.visible = false;
        this.player.body.collisionResponse = false; // "Ghost" the player

        this.vehicleController.attach(vehicle);
        this.thirdPersonCamera.setTarget(vehicle.mesh, true);
        this.currentVehicle = vehicle;
    }

    exitVehicle() {
        if (!this.currentVehicle) return;

        this.player.isInsideVehicle = false;
        this.player.mesh.visible = true;
        this.player.body.collisionResponse = true;

        // Spawn player next to vehicle
        const pos = this.currentVehicle.chassisBody.position;
        this.player.body.position.set(pos.x + 3, pos.y + 1, pos.z);

        this.vehicleController.detach();
        this.thirdPersonCamera.setTarget(this.player, false);
        this.currentVehicle = null;
    }

    addGlobalGround() {
        // Massive plane to cover the horizon
        const gGeo = new THREE.PlaneGeometry(4000, 4000);
        const gMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0f,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(gGeo, gMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    registerDistricts() {
        this.zoneManager.registerDistrictFactory('downtown', createDowntownChunk);
        this.zoneManager.registerDistrictFactory('commercial', createCommercialChunk);
        this.zoneManager.registerDistrictFactory('slums', createCyberSlumsChunk);
    }

    update() {
        super.update();

        const delta = this.engine.clock.getDelta();

        if (this.player) this.player.update(this.engine.camera);
        if (this.thirdPersonCamera) this.thirdPersonCamera.update(delta);
        if (this.interactionManager) this.interactionManager.update();
        if (this.trafficManager) this.trafficManager.update(this.player.getPosition(), delta);
        if (this.npcManager) this.npcManager.update(this.player.getPosition(), delta);
        if (this.vehicleController) this.vehicleController.update();
        if (this.combatManager) this.combatManager.update();
        if (this.wantedManager) this.wantedManager.update(delta);

        this.updateMissionTracking();
        // Update chunks around camera/player tracking
        const trackingPos = this.player.isInsideVehicle ? this.currentVehicle.chassisBody.position : this.player.getPosition();
        this.zoneManager.update(trackingPos);
    }

    updateMissionTracking() {
        if (!this.missionManager) return;

        // Tutorial mission movement objective
        const moveKeys = ['KeyW', 'KeyS', 'KeyA', 'KeyD'];
        if (moveKeys.some(k => this.input.isKeyDown(k))) {
            this.missionManager.completeObjective('tutorial_01', 'move');
        }

        // Proximity to a shop
        const pois = this.poiManager.getAllPOIs();
        const playerPos = this.player.getPosition();
        pois.forEach(poi => {
            if (poi.position.distanceTo(playerPos) < 15) {
                this.missionManager.completeObjective('tutorial_01', 'shop');
            }
        });
    }
}
