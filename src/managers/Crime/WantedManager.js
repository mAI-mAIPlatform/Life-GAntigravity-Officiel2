export class WantedManager {
    constructor() {
        this.level = 0; // 0 to 5
        this.starsContainer = this.createUI();
        this.isBeingChased = false;

        this.crimeCooldown = 0;
        this.cooldownRate = 0.01; // Stars decay slowly
    }

    createUI() {
        const el = document.createElement('div');
        el.id = 'wanted-stars';
        el.className = 'fixed top-12 right-12 flex gap-2 z-[1000]';
        document.body.appendChild(el);
        return el;
    }

    addCrime(type) {
        let starsToAdd = 0;
        switch (type) {
            case 'NPC_KILL': starsToAdd = 1; break;
            case 'VEHICLE_THEFT': starsToAdd = 1; break;
            case 'POLICE_ATTACK': starsToAdd = 2; break;
            case 'RECKLESS_DRIVING': starsToAdd = 0.2; break;
        }

        this.level = Math.min(5, this.level + starsToAdd);
        this.isBeingChased = this.level > 0;
        this.render();
        this.crimeCooldown = 10000; // Reset cooldown when a crime is committed
    }

    update(delta) {
        if (this.level > 0) {
            this.crimeCooldown -= delta * 1000;
            if (this.crimeCooldown <= 0) {
                this.level = Math.max(0, this.level - this.cooldownRate * delta * 10);
                this.render();
            }
        }
    }

    render() {
        const fullStars = Math.floor(this.level);
        let html = '';
        for (let i = 0; i < 5; i++) {
            const opacity = i < fullStars ? 'opacity-100' : 'opacity-20';
            const color = this.level > 0 ? 'text-yellow-400' : 'text-zinc-600';
            const pulse = (i === fullStars && this.level % 1 > 0) ? 'animate-pulse' : '';
            html += `<span class="text-4xl ${opacity} ${color} ${pulse} drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">★</span>`;
        }
        this.starsContainer.innerHTML = html;

        if (this.level === 0) {
            this.starsContainer.classList.add('hidden');
        } else {
            this.starsContainer.classList.remove('hidden');
        }
    }

    getLevel() {
        return Math.floor(this.level);
    }
}
