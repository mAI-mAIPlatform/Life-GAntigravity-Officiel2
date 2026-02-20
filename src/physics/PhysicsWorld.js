import * as CANNON from 'cannon-es';

export class PhysicsWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.allowSleep = true;

        this.timeStep = 1 / 60;
    }

    update() {
        this.world.step(this.timeStep);
    }

    addBody(body) {
        this.world.addBody(body);
    }

    removeBody(body) {
        this.world.removeBody(body);
    }
}
