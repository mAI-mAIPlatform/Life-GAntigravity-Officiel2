export class CharacterData {
    constructor() {
        this.baseStats = {
            health: 100,
            stamina: 100,
            strength: 10,
        };

        this.appearance = {
            gender: 'male', // 'male', 'female', 'neutral'
            skinColor: '#ffe0bd',

            face: {
                jawWidth: 0.5, // 0.0 to 1.0
                cheekbones: 0.5,
                eyeSize: 0.5,
            },

            hair: {
                styleId: 1,
                color: '#2b2b2b',
            },

            body: {
                height: 1.75, // meters
                weight: 70, // kg
                muscleMass: 0.5,
                fat: 0.2
            }
        };

        this.clothing = {
            head: null,
            torso: 'basic_tshirt',
            legs: 'basic_jeans',
            feet: 'sneakers_01',
            accessories: []
        };
    }

    updateAppearance(category, key, value) {
        if (this.appearance[category] !== undefined && this.appearance[category][key] !== undefined) {
            this.appearance[category][key] = value;
            this.triggerCallback('appearance_changed', { category, key, value });
        } else if (this.appearance[category] === undefined && this.appearance[key] !== undefined) {
            this.appearance[key] = value;
            this.triggerCallback('appearance_changed', { key, value });
        }
    }

    setClothing(slot, itemId) {
        if (this.clothing[slot] !== undefined) {
            this.clothing[slot] = itemId;
            this.triggerCallback('clothing_changed', { slot, itemId });
        }
    }

    // Simple event system for UI -> 3D Scene communication
    callbacks = {};
    on(event, callback) {
        if (!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(callback);
    }

    triggerCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb(data));
        }
    }
}
