export class CharacterCreatorUI {
    constructor(characterData) {
        this.data = characterData;
        this.container = document.createElement('div');
        this.container.id = 'cc-ui';
        this.container.className = 'fixed inset-0 z-40 pointer-events-none flex justify-end p-8 font-sans';

        document.body.appendChild(this.container);
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="pointer-events-auto w-96 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 text-white h-full overflow-y-auto hidden-scrollbar">
                
                <div class="border-b border-white/10 pb-4">
                    <h2 class="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">IDENTITY</h2>
                    <p class="text-xs uppercase tracking-widest text-gray-400">Genetics & Style Customization</p>
                </div>

                <!-- GENETICS -->
                <div class="space-y-4">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-blue-400">Body Morph</h3>
                    
                    <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-300 flex justify-between">
                            Height <span id="val-height" class="text-white">${this.data.appearance.body.height}m</span>
                        </label>
                        <input type="range" id="slider-height" min="1.5" max="2.2" step="0.01" value="${this.data.appearance.body.height}" 
                            class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500">
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-300 flex justify-between">
                            Skin Tone
                        </label>
                        <input type="color" id="color-skin" value="${this.data.appearance.skinColor}" 
                            class="w-full h-8 rounded cursor-pointer border-0 bg-transparent">
                    </div>
                </div>

                <!-- FACIAL FEATURES -->
                <div class="space-y-4">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-purple-400">Facial Structure</h3>
                    
                    <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-300 flex justify-between">
                            Jaw Width <span id="val-jaw" class="text-white">${this.data.appearance.face.jawWidth}</span>
                        </label>
                        <input type="range" id="slider-jaw" min="0.1" max="1.0" step="0.01" value="${this.data.appearance.face.jawWidth}" 
                            class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500">
                    </div>
                </div>

                <!-- ACTIONS -->
                <div class="mt-auto pt-6 flex gap-4">
                    <button id="btn-random" class="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-bold tracking-widest uppercase">
                        Randomize
                    </button>
                    <button id="btn-confirm" class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)] text-sm font-bold tracking-widest uppercase text-white">
                        Confirm
                    </button>
                </div>
            </div>
        `;

        // Add CSS for hidden scrollbar directly here for brevity
        const style = document.createElement('style');
        style.innerHTML = `
            .hidden-scrollbar::-webkit-scrollbar { display: none; }
            .hidden-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const sliderHeight = document.getElementById('slider-height');
        const valHeight = document.getElementById('val-height');
        sliderHeight.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            valHeight.innerText = val.toFixed(2) + 'm';
            this.data.updateAppearance('body', 'height', val);
        });

        const colorSkin = document.getElementById('color-skin');
        colorSkin.addEventListener('input', (e) => {
            this.data.updateAppearance('appearance', 'skinColor', e.target.value);
        });

        const sliderJaw = document.getElementById('slider-jaw');
        const valJaw = document.getElementById('val-jaw');
        sliderJaw.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            valJaw.innerText = val.toFixed(2);
            this.data.updateAppearance('face', 'jawWidth', val);
        });

        const btnConfirm = document.getElementById('btn-confirm');
        btnConfirm.addEventListener('click', () => {
            // Trigger confirmation event
            this.data.triggerCallback('creation_complete', this.data);
        });
    }

    destroy() {
        if (this.container) {
            this.container.remove();
        }
    }
}
