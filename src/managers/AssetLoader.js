import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class AssetLoader {
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.gltfLoader = new GLTFLoader(this.manager);
        this.audioLoader = new THREE.AudioLoader(this.manager);

        this.assets = new Map();
        this.onProgress = null;
        this.onComplete = null;
        this.onError = null;

        this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log(`Started loading: ${url}. \nLoaded ${itemsLoaded} of ${itemsTotal} files.`);
        };

        this.manager.onLoad = () => {
            console.log('Loading complete!');
            if (this.onComplete) this.onComplete();
        };

        this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            if (this.onProgress) this.onProgress(progress, url);
        };

        this.manager.onError = (url) => {
            console.error('There was an error loading ' + url);
            if (this.onError) this.onError(url);
        };
    }

    async loadModel(name, path) {
        return new Promise((resolve) => {
            this.gltfLoader.load(path, (gltf) => {
                this.assets.set(name, gltf);
                resolve(gltf);
            }, undefined, (error) => {
                console.error(`Error loading model ${name}:`, error);
                resolve(null); // Resolve with null instead of rejecting to keep loader going
            });
        });
    }

    async loadTexture(name, path) {
        return new Promise((resolve) => {
            this.textureLoader.load(path, (texture) => {
                this.assets.set(name, texture);
                resolve(texture);
            }, undefined, (error) => {
                console.error(`Error loading texture ${name}:`, error);
                resolve(null);
            });
        });
    }

    get(name) {
        return this.assets.get(name);
    }
}
