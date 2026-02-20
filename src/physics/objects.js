import * as CANNON from 'cannon-es';

/**
 * Factory for creating physical bodies in the Cannon.js world.
 */
export class PhysicsObjects {
    /**
     * Creates a box shaped body.
     */
    static createBox(width, height, depth, mass = 1, position = { x: 0, y: 0, z: 0 }) {
        const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: shape
        });
        return body;
    }

    /**
     * Creates a sphere shaped body.
     */
    static createSphere(radius, mass = 1, position = { x: 0, y: 0, z: 0 }) {
        const shape = new CANNON.Sphere(radius);
        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: shape
        });
        return body;
    }

    /**
     * Creates an infinite plane (usually for the ground).
     */
    static createPlane(rotationX = -Math.PI / 2) {
        const shape = new CANNON.Plane();
        const body = new CANNON.Body({
            mass: 0, // static
            shape: shape
        });
        body.quaternion.setFromEuler(rotationX, 0, 0);
        return body;
    }

    /**
     * Creates a cylinder shaped body.
     */
    static createCylinder(radiusTop, radiusBottom, height, segments, mass = 1, position = { x: 0, y: 0, z: 0 }) {
        const shape = new CANNON.Cylinder(radiusTop, radiusBottom, height, segments);
        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            shape: shape
        });
        return body;
    }
}
