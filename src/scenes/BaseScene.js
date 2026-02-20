export class BaseScene {
    constructor(engine, physics) {
        this.engine = engine;
        this.physics = physics;
        this.scene = engine.scene;
        this.world = physics.world;

        this.entities = [];
    }

    init() {
        // To be implemented by subclasses
    }

    update() {
        // To be implemented by subclasses
        this.entities.forEach(entity => {
            if (entity.update) entity.update();
        });
    }

    dispose() {
        // Clean up resources
        this.entities.forEach(entity => {
            if (entity.dispose) entity.dispose();
        });
        this.entities = [];
    }
}
