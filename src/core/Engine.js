import * as THREE from 'three';

export class Engine {
    constructor() {
        this.container = document.getElementById('game-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(callback) {
        this.renderer.setAnimationLoop(() => {
            if (callback) callback();
            this.renderer.render(this.scene, this.camera);
        });
    }
}
