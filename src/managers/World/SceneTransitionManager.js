export class SceneTransitionManager {
    constructor() {
        this.overlay = this.createOverlay();
    }

    createOverlay() {
        const el = document.createElement('div');
        el.id = 'scene-transition-overlay';
        el.className = 'fixed inset-0 bg-black z-[1000] pointer-events-none transition-opacity duration-500 opacity-0';
        document.body.appendChild(el);
        return el;
    }

    async transitionTo(callback) {
        // Fade to black
        this.overlay.style.pointerEvents = 'auto';
        this.overlay.classList.remove('opacity-0');
        this.overlay.classList.add('opacity-100');

        await new Promise(resolve => setTimeout(resolve, 500));

        // Execute scene swap
        if (callback) await callback();

        await new Promise(resolve => setTimeout(resolve, 300));

        // Fade back to transparent
        this.overlay.classList.remove('opacity-100');
        this.overlay.classList.add('opacity-0');

        setTimeout(() => {
            this.overlay.style.pointerEvents = 'none';
        }, 500);
    }
}
