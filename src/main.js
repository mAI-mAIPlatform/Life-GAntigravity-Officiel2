import { Engine } from './core/Engine';
import { World as PhysicsWorld } from './physics/world';
import { NeoCityScene } from './scenes/NeoCity/NeoCityScene';
import { HUD } from './ui/HUD';
import { SystemCore } from './ui/apps/mOS/SystemCore';
import { StoreApp } from './ui/apps/mStore/StoreApp';
import { InventoryApp } from './ui/apps/Inventory/InventoryApp';
import { SettingsApp } from './ui/apps/Settings/SettingsApp';
import { MapApp } from './ui/apps/Map/MapApp';
import { InputManager } from './managers/Input/InputManager';
import { EconomyManager } from './managers/Economy/EconomyManager';
import { MissionManager } from './managers/Missions/MissionManager';
import { MissionApp } from './ui/apps/Missions/MissionApp';
import { ShopUI } from './ui/screens/ShopUI';
import { CharacterCreationScene } from './scenes/Cinematics/CharacterCreationScene';
import { CharacterCreatorUI } from './ui/screens/CharacterCreator';
import { AudioManager } from './audio/audioManager';
import { AssetLoader } from './managers/AssetLoader';
import { LoadingScreen } from './ui/screens/LoadingScreen';
import { assetsManifest } from './assetsManifest';
import './ui/screens/LoadingScreen.css';

class App {
  constructor() {
    this.showLoadingScreen();
  }

  async showLoadingScreen() {
    this.loadingScreen = new LoadingScreen();

    // Catch global errors to display them in the loading screen
    const errorHandler = (event) => {
      const message = event.error ? event.error.message : event.message;
      this.loadingScreen.reportError(message || 'Unknown Engine Error');
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', (event) => {
      this.loadingScreen.reportError(event.reason || 'Async Promise Failure');
    });

    try {
      this.loader = new AssetLoader();
      this.loader.onProgress = (p, url) => this.loadingScreen.updateProgress(p, url);
      this.loader.onError = (url) => this.loadingScreen.reportError(url);

      this.loadingScreen.addLog('> Initializing Core Engine...');
      this.engine = new Engine();

      this.loadingScreen.addLog('> Booting Physics World...');
      this.physics = new PhysicsWorld();
      this.input = new InputManager();
      this.economy = new EconomyManager();
      this.missionManager = new MissionManager(this.economy);
      this.hud = new HUD();

      // Init UI screens
      window.shopUI = new ShopUI(this.economy);
      window.app = this;

      this.missionApp = new MissionApp(this.missionManager);

      this.loadingScreen.addLog('> Calibrating Audio Drivers...');
      this.audio = new AudioManager(this.engine.camera);
      this.audio.initBackgroundMusic();
      this.audio.preloadSFX();

      this.physics.onCollision = () => {
        this.audio.playSFX('collision', 0.5);
      };

      this.mos = new SystemCore();
      this.registerMOSApps();

      this.currentScene = new NeoCityScene(this.engine, this.physics, this.input, this.economy, this.missionManager);

      this.loadingScreen.addLog('> Downloading Neural Assets...');
      // Start loading assets from manifest
      await this.loadAssets();

      this.setupButtons();

      this.loadingScreen.complete(() => {
        // Remove error listeners after successful load
        window.removeEventListener('error', errorHandler);
        this.start();
        // Show main menu with a nice transition
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
          mainMenu.style.display = 'flex';
          mainMenu.style.opacity = '1';
        }
      });

    } catch (error) {
      console.error('Boot failure:', error);
      this.loadingScreen.reportError('BOOT_FAILURE: ' + error.message);
    }
  }

  async loadAssets() {
    const promises = [];

    // Add models to load
    assetsManifest.models.forEach(m => promises.push(this.loader.loadModel(m.name, m.path)));

    // Add textures to load
    assetsManifest.textures.forEach(t => promises.push(this.loader.loadTexture(t.name, t.path)));

    if (promises.length === 0) {
      // If no assets to load, simulate progress for the "vibe"
      return new Promise((resolve) => {
        let progress = 0;
        this.loadingScreen.addLog('> No external assets found, optimizing cache...');
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            this.loadingScreen.updateProgress(100);
            clearInterval(interval);
            setTimeout(resolve, 500);
          } else {
            this.loadingScreen.updateProgress(progress);
          }
        }, 100);
      });
    } else {
      // Wait for all assets (AssetLoader promises resolve even on error)
      await Promise.all(promises);
      this.loadingScreen.updateProgress(100);
      return new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  registerMOSApps() {
    this.mos.registerApp('mstore', 'mStore', '🛍️', 'bg-gradient-to-br from-indigo-500 to-purple-600', StoreApp);
    this.mos.registerApp('inventory', 'Bag', '🎒', 'bg-gradient-to-br from-stone-600 to-orange-700', InventoryApp);
    this.mos.registerApp('map', 'Maps', '🗺️', 'bg-gradient-to-br from-emerald-500 to-teal-700', MapApp);
    this.mos.registerApp('settings', 'Settings', '⚙️', 'bg-gradient-to-br from-slate-400 to-slate-600', SettingsApp);
  }

  setupButtons() {
    const startBtn = document.getElementById('start-btn');
    const mainMenu = document.getElementById('main-menu');

    const optionsBtn = document.getElementById('options-btn');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        try {
          this.audio.playSFX('interaction');
          this.audio.startMusic();
        } catch (e) {
          console.warn('Audio start failed:', e);
        }

        if (mainMenu) {
          mainMenu.style.opacity = '0';
          setTimeout(() => {
            mainMenu.style.display = 'none';
            try {
              this.currentScene.init();
            } catch (sceneError) {
              console.error('Scene init failure:', sceneError);
              this.loadingScreen.reportError('SCENE_INIT_FAILURE: ' + sceneError.message);
            }
          }, 700);
        }
      });
    }

    if (optionsBtn) {
      optionsBtn.addEventListener('click', () => {
        this.audio.playSFX('interaction');

        if (mainMenu) {
          mainMenu.style.opacity = '0';
          setTimeout(() => {
            mainMenu.style.display = 'none';
            this.engine.scene.clear(); // Clear previous things
            this.currentScene = new CharacterCreationScene(this.engine, this.physics, this.input);
            this.currentScene.init();
            this.ccUI = new CharacterCreatorUI(this.currentScene.characterData);

            // Listen to confirm button to switch back to main scene
            this.currentScene.characterData.on('creation_complete', () => {
              this.ccUI.destroy();
              this.engine.scene.clear();
              this.currentScene = new NeoCityScene(this.engine, this.physics, this.input, this.economy, this.missionManager);
              this.currentScene.init();
            });
          }, 700);
        }
      });
    }
  }

  start() {
    let lastTime = performance.now();

    this.engine.render(() => {
      const time = performance.now();
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      this.physics.step(delta);
      this.currentScene.update();
      if (this.input) this.input.update(); // Update input manager
      this.hud.updateFPS(1 / delta);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
