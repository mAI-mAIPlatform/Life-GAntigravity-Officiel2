import { PhoneContainer } from '../../components/Game/PhoneContainer';

export class SystemCore {
    constructor() {
        this.isOpen = false;
        this.phone = new PhoneContainer();
        this.apps = new Map();

        this.bindEvents();
        this.setupDefaultApps();
    }

    bindEvents() {
        // Toggle mOS with TAB key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Home Button inside Phone
        const homeBtn = document.getElementById('mos-home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.goHome();
            });
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.phone.show();
        } else {
            this.phone.hide();
        }
    }

    registerApp(appId, name, iconHtml, colorClass, AppClass) {
        this.phone.addAppIcon(appId, name, iconHtml, colorClass, () => {
            this.launchApp(appId);
        });
        this.apps.set(appId, { config: { name }, AppClass });
    }

    launchApp(appId) {
        const appData = this.apps.get(appId);
        if (!appData) return;

        // Hide home screen
        document.getElementById('mos-home').style.display = 'none';

        // Clear previous app wrapper, create new one
        let wrapper = document.getElementById('mos-active-app');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'mos-active-app';
            wrapper.className = 'absolute inset-0 bg-white z-10 overflow-hidden';
            document.getElementById('mos-screen').appendChild(wrapper);
        } else {
            wrapper.innerHTML = '';
            wrapper.style.display = 'block';
        }

        // Initialize App instance
        const instance = new appData.AppClass(wrapper);
        this.activeApp = instance;
    }

    goHome() {
        const wrapper = document.getElementById('mos-active-app');
        if (wrapper) {
            if (this.activeApp && this.activeApp.destroy) {
                this.activeApp.destroy();
            }
            wrapper.style.display = 'none';
        }
        document.getElementById('mos-home').style.display = 'flex';
        this.activeApp = null;
    }

    setupDefaultApps() {
        // Will be called in main application to register actual apps
    }
}
