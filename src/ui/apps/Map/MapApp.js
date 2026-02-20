export class MapApp {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="h-full bg-slate-900 text-white flex flex-col font-sans relative">
                <!-- Map Background Placeholder -->
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-emerald-950/40 opacity-50 z-0"></div>
                
                <!-- Overlay Elements -->
                <div class="relative z-10 flex flex-col h-full pointer-events-none p-4">
                    
                    <!-- Search Bar -->
                    <div class="w-full bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-lg pointer-events-auto mt-8 relative z-20">
                        <span class="text-gray-400">🔍</span>
                        <input type="text" placeholder="Search NeoCity..." class="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-gray-600">
                        <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs ml-auto shadow-[0_0_10px_blue]">Me</div>
                    </div>

                    <!-- Dynamic Map Pins Container -->
                    <div id="mos-map-pins" class="absolute inset-0 z-10 pointer-events-auto overflow-hidden">
                        <!-- Pins injected via JS -->
                    </div>

                    <!-- Bottom Controls -->
                    <div class="mt-auto self-end flex flex-col gap-2 pointer-events-auto mb-16 relative z-20">
                        <button class="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg">📍</button>
                        <button class="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg">➕</button>
                        <button class="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg">➖</button>
                    </div>

                </div>
            </div>
        `;

        this.renderPOIs();
    }

    renderPOIs() {
        const pinContainer = document.getElementById('mos-map-pins');
        if (!pinContainer || !window.poiManager) return;

        const pois = window.poiManager.getAllPOIs();
        // Since we don't have a real panning/zooming map yet, we'll map world coordinates
        // (-500 to 500) to percentage of screen for a minimap feel
        const worldSize = 1000;

        pois.forEach(poi => {
            // Very simple projection
            const leftPct = ((poi.position.x + worldSize / 2) / worldSize) * 100;
            const topPct = ((poi.position.z + worldSize / 2) / worldSize) * 100;

            const pin = document.createElement('div');
            pin.className = "absolute cursor-pointer hover:scale-110 hover:z-50 transition-transform group";
            pin.style.left = `${leftPct}%`;
            pin.style.top = `${topPct}%`;

            pin.innerHTML = `
                <div class="w-3 h-3 rounded-full ${poi.color} border border-white shadow-[0_0_8px_currentColor] flex items-center justify-center text-[6px]"></div>
                <div class="hidden group-hover:block absolute bg-black/80 backdrop-blur border border-white/20 p-2 rounded -translate-y-full -translate-x-1/2 top-[-5px] whitespace-nowrap z-50">
                    <div class="text-[10px] font-bold text-white flex gap-1 items-center"><span>${poi.icon}</span> ${poi.name}</div>
                    <div class="text-[8px] text-gray-400 mt-1">${poi.type.toUpperCase()}</div>
                </div>
            `;

            pinContainer.appendChild(pin);
        });
    }

    destroy() {
        this.container.innerHTML = '';
    }
}
