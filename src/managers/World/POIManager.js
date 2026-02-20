export const POIType = {
    WEAPON: 'weapon',
    CLOTHING: 'clothing',
    SUPERMARKET: 'supermarket',
    DEALERSHIP: 'dealership',
    APARTMENT: 'apartment',
    HOSPITAL: 'hospital',
    CLUB: 'club',
    CORPO: 'corpo'
};

export class POIManager {
    constructor() {
        this.pois = []; // Global list of points of interest
        // Optimization: could categorize them by chunk coordinates later
    }

    registerPOI(data) {
        const poi = {
            id: `poi_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: data.name || 'Unknown',
            type: data.type || POIType.SUPERMARKET,
            position: { x: data.position.x || 0, y: data.position.y || 0, z: data.position.z || 0 },
            icon: this.getIconForType(data.type),
            color: this.getColorForType(data.type),
            description: data.description || '',
            interiorScene: data.interiorScene || null,
        };
        this.pois.push(poi);
        return poi.id;
    }

    getIconForType(type) {
        switch (type) {
            case POIType.WEAPON: return '🔫';
            case POIType.CLOTHING: return '👕';
            case POIType.SUPERMARKET: return '🛒';
            case POIType.DEALERSHIP: return '🚗';
            case POIType.APARTMENT: return '🏢';
            case POIType.HOSPITAL: return '🏥';
            case POIType.CLUB: return '🪩';
            case POIType.CORPO: return '💼';
            default: return '📍';
        }
    }

    getColorForType(type) {
        switch (type) {
            case POIType.WEAPON: return 'bg-rose-500';
            case POIType.CLOTHING: return 'bg-indigo-500';
            case POIType.SUPERMARKET: return 'bg-emerald-500';
            case POIType.DEALERSHIP: return 'bg-cyan-500';
            case POIType.APARTMENT: return 'bg-fuchsia-500';
            case POIType.HOSPITAL: return 'bg-red-600';
            case POIType.CLUB: return 'bg-purple-600';
            case POIType.CORPO: return 'bg-slate-700';
            default: return 'bg-gray-500';
        }
    }

    getAllPOIs() {
        return this.pois;
    }

    getNearbyPOIs(position, radius) {
        return this.pois.filter(poi => {
            const dx = poi.position.x - position.x;
            const dz = poi.position.z - position.z;
            return (dx * dx + dz * dz) <= radius * radius;
        });
    }

    generateMockPOIs(count = 50, worldSize = 500) {
        const types = Object.values(POIType);
        const prefixes = ['Neo', 'Cyber', 'Quantum', 'Aero', 'Chroma', 'Vertex', 'Nexus'];
        const suffixes = ['Mart', 'Store', 'Hub', 'Plaza', 'Boutique', 'Works', 'Dynamics'];

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;

            this.registerPOI({
                name,
                type,
                position: {
                    x: (Math.random() - 0.5) * worldSize,
                    y: 0,
                    z: (Math.random() - 0.5) * worldSize
                },
                description: `A highly rated ${type} establishment.`
            });
        }
    }
}
