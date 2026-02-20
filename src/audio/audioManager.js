import * as THREE from 'three';

/**
 * AudioManager handles all sound-related tasks in the game.
 * It manages background music streaming and preloads SFX for immediate playback.
 */
export class AudioManager {
    constructor(camera) {
        this.camera = camera;
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        this.backgroundMusic = null;
        this.sfxBuffers = new Map();
        this.loader = new THREE.AudioLoader();

        this.isMuted = false;
        this.masterVolume = 0.5;

        // Sound definitions
        this.sounds = {
            background: '/assets/audio/music/background.mp3',
            collision: '/assets/audio/sfx/collision.mp3',
            interaction: '/assets/audio/sfx/interaction.mp3'
        };
    }

    /**
     * Initializes and plays background music with streaming to save memory.
     */
    initBackgroundMusic() {
        const audio = new Audio(this.sounds.background);
        audio.loop = true;

        this.backgroundMusic = new THREE.Audio(this.listener);
        this.backgroundMusic.setMediaElementSource(audio);
        this.backgroundMusic.setVolume(this.masterVolume * 0.4);

        console.log("Audio: Background music initialized (Streamed)");
    }

    /**
     * Preloads essential SFX into memory for low-latency playback.
     */
    async preloadSFX() {
        const sfxToLoad = [
            { name: 'collision', path: this.sounds.collision },
            { name: 'interaction', path: this.sounds.interaction }
        ];

        const loadPromises = sfxToLoad.map(sfx => {
            return new Promise((resolve) => {
                this.loader.load(sfx.path, (buffer) => {
                    this.sfxBuffers.set(sfx.name, buffer);
                    console.log(`Audio: SFX Loaded - ${sfx.name}`);
                    resolve();
                }, undefined, (err) => {
                    console.warn(`Audio: Failed to load SFX ${sfx.name} at ${sfx.path}`, err);
                    resolve(); // Resolve anyway to not block
                });
            });
        });

        await Promise.all(loadPromises);
    }

    /**
     * Plays a specific SFX from the preloaded buffers.
     */
    playSFX(name, volume = 1) {
        if (this.isMuted) return;

        const buffer = this.sfxBuffers.get(name);
        if (buffer) {
            const sound = new THREE.Audio(this.listener);
            sound.setBuffer(buffer);
            sound.setVolume(this.masterVolume * volume);
            sound.play();
        }
    }

    /**
     * Starts the background music. 
     * Note: Browsers require user interaction before playing audio.
     */
    startMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play();
        }
    }

    stopMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
    }

    setVolume(value) {
        this.masterVolume = THREE.MathUtils.clamp(value, 0, 1);
        if (this.backgroundMusic) {
            this.backgroundMusic.setVolume(this.masterVolume * 0.4);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }
}
