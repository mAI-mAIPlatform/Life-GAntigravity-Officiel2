export class HUD {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'game-hud';
        this.container.className = 'fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 font-sans';

        document.body.appendChild(this.container);
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white">
                    <h1 class="text-2xl font-bold tracking-tighter text-blue-400">LIFE ENGINE</h1>
                    <p class="text-xs opacity-60 uppercase tracking-widest">v1.0.0 Architecture Ready</p>
                </div>
                <div class="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 text-right">
                    <div id="fps-counter" class="text-white font-mono text-xl">60 FPS</div>
                    <div class="text-[10px] text-green-400 font-bold uppercase tracking-tighter">Physics Active</div>
                </div>
            </div>

            <div class="flex justify-center items-end gap-4">
                <div class="bg-black/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 w-96">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-white text-xs font-bold uppercase tracking-tight">System Status</span>
                        <span class="text-blue-400 text-xs font-mono">STABLE</span>
                    </div>
                    <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div id="health-bar" class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[85%]"></div>
                    </div>
                </div>
            </div>
        `;
    }

    updateFPS(fps) {
        const el = document.getElementById('fps-counter');
        if (el) el.innerText = `${Math.round(fps)} FPS`;
    }
}
