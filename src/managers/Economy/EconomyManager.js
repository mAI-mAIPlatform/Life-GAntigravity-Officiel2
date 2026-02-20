export class EconomyManager {
    constructor() {
        this.balance = 10000; // Starting money
        this.transactions = [];
    }

    setBalance(amount) {
        this.balance = amount;
        this.notifyUpdate();
    }

    addMoney(amount) {
        this.balance += amount;
        this.transactions.push({ type: 'income', amount, date: Date.now() });
        this.notifyUpdate();
    }

    spendMoney(amount, reason = 'Purchase') {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.transactions.push({ type: 'expense', amount, reason, date: Date.now() });
            this.notifyUpdate();
            return true;
        }
        return false;
    }

    getBalance() {
        return this.balance;
    }

    notifyUpdate() {
        // Dispatch event for UI updates (like HUD or mOS)
        const event = new CustomEvent('economy_update', { detail: { balance: this.balance } });
        window.dispatchEvent(event);
    }
}
