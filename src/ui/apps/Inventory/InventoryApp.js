export class InventoryApp {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="h-full bg-stone-950 text-stone-300 flex flex-col font-sans">
                <!-- Header -->
                <div class="pt-12 pb-4 px-6 bg-stone-900/80 backdrop-blur-md border-b border-stone-800 sticky top-0 z-20 flex justify-between items-end">
                    <div>
                        <h1 class="text-3xl font-black tracking-tight text-stone-100">Inventory</h1>
                        <p class="text-[10px] uppercase tracking-widest text-stone-500 mt-1">3 / 20 Slots Used</p>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-stone-400 block block">Balance</span>
                        <span class="font-mono text-green-400 font-bold tracking-tight">m$ 12,450</span>
                    </div>
                </div>

                <!-- Grid -->
                <div class="flex-1 overflow-y-auto hidden-scrollbar p-6">
                    <div class="grid grid-cols-3 gap-3">
                        <!-- Item 1 -->
                        <div class="bg-stone-900 aspect-square rounded-2xl border border-stone-800/50 p-3 flex flex-col justify-between hover:border-orange-500/50 transition-colors cursor-pointer relative group">
                            <span class="absolute top-2 right-2 flex w-2 h-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full w-2 h-2 bg-orange-500"></span>
                            </span>
                            <div class="text-2xl opacity-60 group-hover:opacity-100 transition-opacity self-center mt-2">🍔</div>
                            <span class="text-[9px] font-medium text-center truncate text-stone-400 group-hover:text-stone-200">Krabby Patty</span>
                        </div>

                        <!-- Item 2 -->
                        <div class="bg-stone-900 aspect-square rounded-2xl border border-stone-800/50 p-3 flex flex-col justify-between hover:border-stone-500/50 transition-colors cursor-pointer group">
                            <div class="absolute bottom-2 right-2 text-[10px] font-bold text-stone-500 bg-stone-950 px-1 rounded">x3</div>
                            <div class="text-2xl opacity-60 group-hover:opacity-100 transition-opacity self-center mt-2">🔑</div>
                            <span class="text-[9px] font-medium text-center truncate text-stone-400 group-hover:text-stone-200">Apartment Key</span>
                        </div>

                        <!-- Empty Slots -->
                        <div class="bg-stone-900/50 aspect-square rounded-2xl border border-stone-800/30 border-dashed flex items-center justify-center"></div>
                        <div class="bg-stone-900/50 aspect-square rounded-2xl border border-stone-800/30 border-dashed flex items-center justify-center"></div>
                        <div class="bg-stone-900/50 aspect-square rounded-2xl border border-stone-800/30 border-dashed flex items-center justify-center"></div>
                        <div class="bg-stone-900/50 aspect-square rounded-2xl border border-stone-800/30 border-dashed flex items-center justify-center"></div>
                        <div class="bg-stone-900/50 aspect-square rounded-2xl border border-stone-800/30 border-dashed flex items-center justify-center"></div>
                        <div class="bg-stone-900/50 aspect-square rounded-2xl border border-stone-800/30 border-dashed flex items-center justify-center"></div>
                        <div class="bg-stone-900/50 aspect-square rounded-2xl border border-stone-800/30 border-dashed flex items-center justify-center"></div>
                    </div>
                </div>
            </div>
        `;
    }

    destroy() {
        this.container.innerHTML = '';
    }
}
