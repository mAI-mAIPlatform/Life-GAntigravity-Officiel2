export class MissionManager {
    constructor(economyManager) {
        this.economyManager = economyManager;
        this.missions = [];
        this.activeMissions = [];
        this.completedMissions = [];

        this.initTasks();
    }

    initTasks() {
        // Mock data for initial missions
        this.missions = [
            {
                id: 'tutorial_01',
                title: 'Premier Pas à NeoCity',
                desc: 'Explorez la ville et trouvez le mStore le plus proche.',
                reward: 500,
                objectives: [
                    { id: 'move', label: 'Utilisez ZQSD pour marcher', completed: false },
                    { id: 'shop', label: 'Approchez vous d\'un mStore', completed: false }
                ],
                status: 'AVAILABLE'
            },
            {
                id: 'courier_01',
                title: 'Livraison Express',
                desc: 'Livrez un colis à l\'armurerie du centre-ville.',
                reward: 1200,
                objectives: [
                    { id: 'pick_up', label: 'Récupérez le colis auprès du PNJ', completed: false },
                    { id: 'deliver', label: 'Livrez à l\'Armurerie', completed: false }
                ],
                status: 'AVAILABLE'
            }
        ];
    }

    startMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (mission && mission.status === 'AVAILABLE') {
            mission.status = 'ACTIVE';
            this.activeMissions.push(mission);
            this.notifyUpdate();
            this.showMissionNotification(`Mission Commencée: ${mission.title}`);
        }
    }

    completeObjective(missionId, objectiveId) {
        const mission = this.activeMissions.find(m => m.id === missionId);
        if (mission) {
            const objective = mission.objectives.find(o => o.id === objectiveId);
            if (objective && !objective.completed) {
                objective.completed = true;
                this.checkMissionCompletion(mission);
                this.notifyUpdate();
            }
        }
    }

    checkMissionCompletion(mission) {
        const allCompleted = mission.objectives.every(o => o.completed);
        if (allCompleted) {
            mission.status = 'COMPLETED';
            this.activeMissions = this.activeMissions.filter(m => m.id !== mission.id);
            this.completedMissions.push(mission);

            // Give reward
            this.economyManager.addMoney(mission.reward);
            this.showMissionNotification(`Mission Terminée: ${mission.title} (+$${mission.reward})`);
        }
    }

    showMissionNotification(text) {
        const el = document.createElement('div');
        el.className = 'fixed top-12 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-2xl z-[1000] border border-white/20 font-bold animate-bounce';
        el.innerText = text;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }

    notifyUpdate() {
        window.dispatchEvent(new CustomEvent('mission_update', {
            detail: { active: this.activeMissions, missions: this.missions }
        }));
    }

    getActiveMissions() {
        return this.activeMissions;
    }
}
