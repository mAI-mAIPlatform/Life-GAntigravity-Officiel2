export class ShopUI {
    constructor(economyManager) {
        this.economyManager = economyManager;
        this.container = this.createUI();
        this.isOpen = false;
        this.currentShop = null;
    }

    createUI() {
        const el = document.createElement('div');
        el.id = 'shop-ui-overlay';
        el.className = 'fixed inset-0 z-[500] hidden flex items-center justify-center bg-black/40 backdrop-blur-sm p-8';
        document.body.appendChild(el);
        return el;
    }

    open(shopData) {
        this.currentShop = shopData;
        this.isOpen = true;
        this.render();
        this.container.classList.remove('hidden');
    }

    close() {
        this.isOpen = false;
        this.container.classList.add('hidden');
    }

    render() {
        if (!this.currentShop) return;

        // Mock items based on shop type
        const items = this.getMockItems(this.currentShop.type);

        this.container.innerHTML = `
            <div class="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden shadow-2xl scale-in-center">
                <!-- Header -->
                <div class="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                    <div>
                        <h2 class="text-3xl font-bold text-white">${this.currentShop.name}</h2>
                        <p class="text-zinc-500 text-sm mt-1">${this.currentShop.type.toUpperCase()} • NÉOCITY BRANCH</p>
                    </div>
                    <div class="flex items-center gap-6">
                        <div class="text-right">
                            <div class="text-zinc-500 text-xs uppercase tracking-widest font-bold">Solde</div>
                            <div class="text-2xl font-mono text-emerald-400">$${Math.floor(this.economyManager.getBalance()).toLocaleString()}</div>
                        </div>
                        <button onclick="window.shopUI.close()" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">✕</button>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-6">
                    ${items.map(item => `
                        <div class="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all group">
                            <div class="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                                ${item.icon}
                            </div>
                            <div class="flex-1 flex flex-col">
                                <h3 class="font-bold text-white text-lg">${item.name}</h3>
                                <p class="text-zinc-500 text-xs mt-1 line-clamp-2">${item.desc}</p>
                                <div class="mt-auto flex justify-between items-center">
                                    <span class="text-emerald-400 font-mono font-bold">$${item.price.toLocaleString()}</span>
                                    <button onclick="window.shopUI.buyItem('${item.id}', ${item.price})" class="px-4 py-1.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-emerald-400 hover:text-white transition-all">ACHETER</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getMockItems(type) {
        switch (type) {
            case 'weapon':
                return [
                    { id: 'pistol_01', name: 'M-99 Cyber', desc: 'Pistolet standard de sécurité urbaine.', price: 1200, icon: '🔫' },
                    { id: 'smg_01', name: 'Neon Shredder', desc: 'Cadence de tir élevée pour zones confinées.', price: 3500, icon: '📟' }
                ];
            case 'clothing':
                return [
                    { id: 'jacket_01', name: 'Reflex Jacket', desc: 'Protection thermique et style neon-chrome.', price: 450, icon: '🧥' },
                    { id: 'helmet_01', name: 'HUD Helmet', desc: 'Interface neuronale intégrée.', price: 800, icon: '🪖' }
                ];
            default:
                return [
                    { id: 'item_01', name: 'Synth-Soda', desc: 'Boisson rafraîchissante ionisée.', price: 5, icon: '🥤' }
                ];
        }
    }

    buyItem(id, price) {
        if (this.economyManager.spendMoney(price, `Achat ${id}`)) {
            console.log(`Objet acheté : ${id}`);
            this.render(); // Refresh balance
            // Notify inventory...
        } else {
            alert("Fonds insuffisants !");
        }
    }
}
