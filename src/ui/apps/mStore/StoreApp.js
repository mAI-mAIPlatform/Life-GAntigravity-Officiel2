export class StoreApp {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="h-full bg-zinc-950 text-white flex flex-col font-sans">
                <!-- Header -->
                <div class="pt-12 pb-4 px-6 bg-blue-900/20 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
                    <h1 class="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">mStore</h1>
                    <p class="text-[10px] uppercase tracking-widest text-blue-200/50 mt-1">Liquid Glass Ecosystem</p>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto hidden-scrollbar p-6 space-y-6">
                    
                    <!-- Featured -->
                    <div class="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 relative overflow-hidden shadow-[0_10px_30px_rgba(99,102,241,0.3)]">
                        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <span class="px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur inline-block mb-3">Featured</span>
                        <h2 class="text-2xl font-bold mb-1 shadow-black drop-shadow-md">Cyber Jacket V2</h2>
                        <p class="text-xs text-white/80 max-w-[70%] drop-shadow-sm">The latest in virtual fashion. 100% waterproof nanotech.</p>
                        <button class="mt-4 bg-white text-indigo-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-transform">Buy - m$ 4,500</button>
                    </div>

                    <!-- Categories -->
                    <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400 mt-8 mb-4">Trending Categories</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-zinc-900 rounded-2xl p-4 border border-white/5 hover:border-blue-500/50 transition-colors cursor-pointer group">
                            <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">👕</div>
                            <h4 class="font-bold text-sm">Apparel</h4>
                            <p class="text-[10px] text-gray-500 mt-1">142 items</p>
                        </div>
                        <div class="bg-zinc-900 rounded-2xl p-4 border border-white/5 hover:border-pink-500/50 transition-colors cursor-pointer group">
                            <div class="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 mb-3 group-hover:bg-pink-500 group-hover:text-white transition-colors">🚗</div>
                            <h4 class="font-bold text-sm">Vehicles</h4>
                            <p class="text-[10px] text-gray-500 mt-1">28 models</p>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    destroy() {
        this.container.innerHTML = '';
    }
}
