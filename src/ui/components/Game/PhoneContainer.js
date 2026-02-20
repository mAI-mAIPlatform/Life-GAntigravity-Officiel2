export class PhoneContainer {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'mos-container';
        this.container.className = 'fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-all duration-500 opacity-0 translate-y-10 scale-95';

        document.body.appendChild(this.container);
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <!-- Device Shell (iPhone style) -->
            <div class="pointer-events-auto relative w-[375px] h-[812px] bg-black rounded-[50px] border-[8px] border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                
                <!-- Notch / Dynamic Island -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50 flex justify-center items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-zinc-800 border-2 border-zinc-900 shadow-inner"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-900/50 shadow-[0_0_5px_blue]"></div>
                </div>

                <!-- Status Bar -->
                <div class="w-full h-12 pt-3 px-6 flex justify-between items-center text-white text-xs z-40 relative">
                    <span class="font-bold tracking-wider" id="mos-time">12:00</span>
                    <div class="flex gap-2 items-center">
                        <span class="font-bold">5G</span>
                        <div class="w-6 h-3 bg-white/20 rounded-sm relative shadow-inner">
                            <div class="absolute left-0.5 top-0.5 bottom-0.5 bg-white rounded-sm w-4/5"></div>
                            <div class="absolute -right-1 top-1 w-1 h-1 bg-white/50 rounded-r-sm"></div>
                        </div>
                    </div>
                </div>

                <!-- mOS Screen Content Area -->
                <div id="mos-screen" class="flex-1 w-full bg-zinc-900 relative overflow-hidden">
                    <!-- Home Screen Grid -->
                    <div id="mos-home" class="absolute inset-0 p-6 flex flex-wrap gap-4 content-start">
                        <!-- Apps will be injected here -->
                    </div>
                </div>

                <!-- Home Indicator -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/50 rounded-full cursor-pointer hover:bg-white transition-colors z-50" id="mos-home-btn"></div>
            </div>
        `;

        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const timeEl = document.getElementById('mos-time');
        if (timeEl) {
            const now = new Date();
            timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    show() {
        this.container.classList.remove('opacity-0', 'translate-y-10', 'scale-95', 'pointer-events-none');
        this.container.classList.add('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
    }

    hide() {
        this.container.classList.add('opacity-0', 'translate-y-10', 'scale-95', 'pointer-events-none');
        this.container.classList.remove('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
    }

    addAppIcon(appId, name, iconHtml, colorClass, onClick) {
        const homeScreen = document.getElementById('mos-home');
        if (!homeScreen) return;

        const btn = document.createElement('button');
        btn.className = `w-16 h-16 rounded-2xl ${colorClass} text-white flex flex-col items-center justify-center gap-1 shadow-lg hover:scale-105 active:scale-95 transition-transform group relative`;
        btn.innerHTML = `
            <div class="text-2xl drop-shadow-md">${iconHtml}</div>
            <span class="text-[10px] font-medium tracking-tight mt-1 opacity-80 group-hover:opacity-100 absolute -bottom-4">${name}</span>
        `;

        btn.addEventListener('click', onClick);
        homeScreen.appendChild(btn);
    }
}
