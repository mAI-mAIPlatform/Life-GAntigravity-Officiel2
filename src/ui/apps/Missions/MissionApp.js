export class MissionApp {
    constructor(missionManager) {
        this.missionManager = missionManager;
        this.container = null;

        window.addEventListener('mission_update', () => {
            if (this.isVisible) this.render();
        });
    }

    init(container) {
        this.container = container;
        this.render();
    }

    render() {
        if (!this.container) return;

        const activeMissions = this.missionManager.getActiveMissions();
        const availableMissions = this.missionManager.missions.filter(m => m.status === 'AVAILABLE');

        this.container.innerHTML = `
            <div class="p-6 h-full flex flex-col bg-zinc-950 text-white overflow-hidden">
                <h2 class="text-3xl font-black mb-6 flex items-center gap-3">
                    <span class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]">M</span>
                    MISSIONS
                </h2>

                <!-- Active Missions -->
                <div class="mb-8">
                    <h3 class="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Missions Actives</h3>
                    ${activeMissions.length === 0 ? `
                        <div class="bg-white/5 rounded-2xl p-6 text-zinc-500 text-sm border border-dashed border-white/10 text-center">
                            Aucune mission en cours.
                        </div>
                    ` : activeMissions.map(m => `
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 shadow-xl">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg">${m.title}</h4>
                                <span class="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded font-black">$${m.reward}</span>
                            </div>
                            <p class="text-zinc-400 text-xs mb-4">${m.desc}</p>
                            <div class="space-y-2">
                                ${m.objectives.map(obj => `
                                    <div class="flex items-center gap-3 ${obj.completed ? 'opacity-40' : ''}">
                                        <div class="w-4 h-4 rounded border ${obj.completed ? 'bg-blue-500 border-blue-500' : 'border-white/20'} flex items-center justify-center">
                                            ${obj.completed ? '✓' : ''}
                                        </div>
                                        <span class="text-[11px] ${obj.completed ? 'line-through' : ''}">${obj.label}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Available Missions -->
                <div class="flex-1 overflow-y-auto">
                    <h3 class="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Contrats Disponibles</h3>
                    ${availableMissions.map(m => `
                        <button onclick="window.app.missionManager.startMission('${m.id}')" class="w-full text-left bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-blue-500/50 rounded-2xl p-5 mb-3 transition-all group">
                            <div class="flex justify-between items-center">
                                <h4 class="font-bold text-zinc-300 group-hover:text-blue-400 transition-colors">${m.title}</h4>
                                <span class="text-emerald-500 font-mono font-bold">$${m.reward}</span>
                            </div>
                            <p class="text-[10px] text-zinc-600 mt-1 uppercase tracking-tighter">Cliquez pour accepter</p>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
}
