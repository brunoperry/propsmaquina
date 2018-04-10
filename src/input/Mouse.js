import Vec2 from "../core/math/Vec2.js";
import Display from "../core/Display.js";

class Mouse {
    constructor() { }

    static create() {

        Display.canvas.onmousedown = (event) => {
            Mouse.buttons[e.button] = true;
        }
        Display.canvas.onmouseup = (event) => {
            Mouse.buttons[e.button] = false;
        }
    }
    static moveCallback(event) {

        let x = Mouse.currentPosition.getX();
        let y = Mouse.currentPosition.getY();

        let x1 = -e.movementX;
        let y1 = -e.movementY;

        if (x === x1 && y === y1) {
            Mouse.currentPosition.setX(0);
            Mouse.currentPosition.setY(0);

        } else {
            Mouse.currentPosition.setX(x1);
            Mouse.currentPosition.setY(y1);
        }
    }

    static isButtonDown(buttonCode) {
        return Mouse.buttons[buttonCode] === true;
    }
    static getX() {
        return Mouse.currentPosition.getX();
    }
    static getY() {
        return Mouse.currentPosition.getY();
    }
    static setMouseLock(lock) {
        Mouse.isLocked = lock;
        if(!lock) {
            Display.canvas.removeEventListener("mousemove", Mouse.moveCallback);
        } else {
            Display.canvas.addEventListener("mousemove", Mouse.moveCallback);
        }
    }
}


Mouse.FIRE = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;
Mouse.NUM_MOUSE_BUTTONS = 3;

Mouse.currentPosition = new Vec2();
Mouse.previousPosition = new Vec2();

Mouse.buttons = [];
Mouse.sensitivity = 0.3;
Mouse.isLocked = false;

export default Mouse;











// public static isButtonDown(buttonCode: number): boolean {
//     return Mouse.buttons[buttonCode] === true;
// }

// public static getX(): number {
//     return Mouse.currentPosition.getX();
// }
// public static getY(): number {
//     return Mouse.currentPosition.getY();
// }

// public static setMouseLock(lock: boolean): void {

//     Mouse.isLocked = lock;

//     if(!lock) {
//         Display.canvas.removeEventListener("mousemove", Mouse.moveCallback);
//     } else {
//         Display.canvas.addEventListener("mousemove", Mouse.moveCallback);
//     }
// }
// }