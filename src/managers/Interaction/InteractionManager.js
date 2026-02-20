import * as THREE from 'three';

export class InteractionManager {
    constructor(player, scene, camera) {
        this.player = player;
        this.scene = scene;
        this.camera = camera;
        this.interactables = [];
        this.currentInteractable = null;

        this.raycaster = new THREE.Raycaster();
        this.rayDirection = new THREE.Vector3();

        this.promptElement = this.createPromptUI();
    }

    createPromptUI() {
        const el = document.createElement('div');
        el.id = 'interaction-prompt';
        el.className = 'fixed bottom-1/4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-2xl hidden flex items-center gap-4 shadow-2xl z-[100] transition-all duration-300 scale-90 opacity-0';
        el.innerHTML = `
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)]">E</div>
            <div class="flex flex-col">
                <span id="prompt-action" class="text-xs text-blue-400 font-bold uppercase tracking-widest">Interagir</span>
                <span id="prompt-label" class="text-lg font-medium">Objet</span>
            </div>
        `;
        document.body.appendChild(el);
        return el;
    }

    addInteractable(object, label, action, callback) {
        this.interactables.push({ object, label, action, callback });
    }

    removeInteractable(object) {
        this.interactables = this.interactables.filter(i => i.object !== object);
    }

    update() {
        if (!this.player || !this.player.mesh || this.player.isInsideVehicle) {
            if (this.currentInteractable) this.hidePrompt();
            this.currentInteractable = null;
            return;
        }

        const playerPos = this.player.getPosition();
        let closest = null;
        let minDistance = 3; // Maximum interaction range

        for (const interactable of this.interactables) {
            // Convert to THREE.Vector3 if it's not (like CANNON.Vec3) or just manual distance
            const targetPos = interactable.object.position;
            const dx = playerPos.x - targetPos.x;
            const dy = playerPos.y - targetPos.y;
            const dz = playerPos.z - targetPos.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < minDistance) {
                minDistance = distance;
                closest = interactable;
            }
        }

        if (closest !== this.currentInteractable) {
            this.currentInteractable = closest;
            if (this.currentInteractable) {
                this.showPrompt(this.currentInteractable);
            } else {
                this.hidePrompt();
            }
        }
    }

    showPrompt(interactable) {
        const labelEl = document.getElementById('prompt-label');
        const actionEl = document.getElementById('prompt-action');
        labelEl.innerText = interactable.label;
        actionEl.innerText = interactable.action;

        this.promptElement.classList.remove('hidden');
        setTimeout(() => {
            this.promptElement.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    hidePrompt() {
        this.promptElement.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            if (!this.currentInteractable) {
                this.promptElement.classList.add('hidden');
            }
        }, 300);
    }

    handleInput(keyCode) {
        if (keyCode === 'KeyE' && this.currentInteractable) {
            this.currentInteractable.callback();
        }

        // Logic to exit vehicle
        if (keyCode === 'KeyF' && this.player.isInsideVehicle) {
            if (this.onExitVehicle) this.onExitVehicle();
        }
    }
}
