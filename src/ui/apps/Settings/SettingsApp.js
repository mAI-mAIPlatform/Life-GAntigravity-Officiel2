export class SettingsApp {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="h-full bg-slate-100 text-slate-900 flex flex-col font-sans">
                <!-- Header -->
                <div class="pt-12 pb-4 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
                    <h1 class="text-3xl font-black tracking-tight">Settings</h1>
                </div>

                <!-- Settings List -->
                <div class="flex-1 overflow-y-auto hidden-scrollbar p-0 bg-slate-100">
                    
                    <!-- Group 1 -->
                    <div class="mt-6 mb-2 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">System</div>
                    <div class="bg-white border-y border-slate-200">
                        <div class="flex justify-between items-center py-3 px-6 border-b border-slate-100 cursor-pointer active:bg-slate-50">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs">📶</div>
                                <span class="text-sm font-medium">Wi-Fi & Network</span>
                            </div>
                            <span class="text-slate-400 text-sm">NeoCity_FreeWifi ></span>
                        </div>
                        <div class="flex justify-between items-center py-3 px-6 cursor-pointer active:bg-slate-50">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs">🔋</div>
                                <span class="text-sm font-medium">Battery</span>
                            </div>
                            <span class="text-slate-400 text-sm">84% ></span>
                        </div>
                    </div>

                    <!-- Group 2 -->
                    <div class="mt-8 mb-2 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Game Preferences</div>
                    <div class="bg-white border-y border-slate-200">
                        <div class="flex justify-between items-center py-3 px-6 border-b border-slate-100">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs">🔊</div>
                                <span class="text-sm font-medium">Audio Volumes</span>
                            </div>
                            <span class="text-slate-400 text-sm">></span>
                        </div>
                        <div class="flex justify-between items-center py-3 px-6 border-b border-slate-100">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xs">🎮</div>
                                <span class="text-sm font-medium">Controls</span>
                            </div>
                            <span class="text-slate-400 text-sm">></span>
                        </div>
                        <div class="flex justify-between items-center py-3 px-6">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs">📺</div>
                                <span class="text-sm font-medium">Graphics (Post-Process)</span>
                            </div>
                            <span class="text-slate-400 text-sm">Ultra ></span>
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
