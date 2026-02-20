import * as CANNON from 'cannon-es';

/**
 * World class wraps the Cannon-es physics engine.
 * optimized for large scale simulations.
 */
export class World {
    constructor() {
        this.world = new CANNON.World();

        // Use SAPBroadphase for better performance with many objects
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);

        // Set gravity (standard earth gravity)
        this.world.gravity.set(0, -9.82, 0);

        // Allow bodies to sleep when not moving to save CPU
        this.world.allowSleep = true;

        // Default solver parameters for stability
        this.world.solver.iterations = 10;
        this.world.solver.tolerance = 0.001;

        // Default contact material for global bounce/friction
        this.defaultMaterial = new CANNON.Material('default');
        const defaultContactMaterial = new CANNON.ContactMaterial(
            this.defaultMaterial,
            this.defaultMaterial,
            {
                friction: 0.3,
                restitution: 0.7, // High restitution for bouncing
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3,
                frictionEquationStiffness: 1e8,
                frictionEquationRegularizationTime: 3,
            }
        );
        this.world.addContactMaterial(defaultContactMaterial);
        this.world.defaultContactMaterial = defaultContactMaterial;

        this.timeStep = 1 / 60;
        this.lastTime = 0;

        this.onCollision = null;

        // Listen for all collisions in the world
        this.world.addEventListener('beginContact', (event) => {
            if (this.onCollision) {
                // We can calculate impact velocity here if needed
                this.onCollision(event);
            }
        });
    }

    /**
     * Step the physics world forward in time.
     * @param {number} deltaTime - Time since last frame in seconds.
     */
    step(deltaTime) {
        // Clamp delta time to avoid huge jumps
        const fixedDeltaTime = Math.min(deltaTime, 0.1);
        this.world.step(this.timeStep, fixedDeltaTime);
    }

    addBody(body) {
        if (!body.material) {
            body.material = this.defaultMaterial;
        }
        this.world.addBody(body);
        return body;
    }

    removeBody(body) {
        this.world.removeBody(body);
    }
}
