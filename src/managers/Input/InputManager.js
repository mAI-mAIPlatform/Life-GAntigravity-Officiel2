export class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            isDown: false
        };
        this.isPointerLockEnabled = false;

        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.dx = e.movementX;
            this.mouse.dy = e.movementY;
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('mousedown', () => {
            this.mouse.isDown = true;
        });

        window.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
        });

        // Lock pointer for first person / third person rotation
        document.addEventListener('click', () => {
            if (document.pointerLockElement !== document.body && this.isPointerLockEnabled) {
                document.body.requestPointerLock();
            }
        });
    }

    enablePointerLock() {
        this.isPointerLockEnabled = true;
    }

    disablePointerLock() {
        this.isPointerLockEnabled = false;
    }

    isKeyDown(code) {
        return !!this.keys[code];
    }

    update() {
        // Reset delta values after each frame
        this.mouse.dx = 0;
        this.mouse.dy = 0;
    }
}
