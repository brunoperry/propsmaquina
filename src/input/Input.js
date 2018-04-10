import Vec2 from "../core/math/Vec2.js";
import Keyboard from "./Keyboard.js";
import Mouse from "./Mouse.js";

class Input {

    constructor() { }

    static update() {

        for (let i = 0; i < Keyboard.NUM_KEYCODES; i++) {
            Input.lastKeys[i] = Input.getKey(i);
        }

        for (let i = 0; i < Mouse.NUM_MOUSE_BUTTONS; i++) {
            Input.lastMouse[i] = Input.getMouse(i);
        }
    }

    //     //KEYBOARD STUFF
    static getKey(keyCode) {
        return Keyboard.isKeyDown(keyCode);
    }
    static getKeyDown(keyCode) {
        return Input.getKey(keyCode) && !Input.lastKeys[keyCode];
    }
    static getKeyUp(keyCode) {
        return !Input.getKey(keyCode) && Input.lastKeys[keyCode];
    }

    //     //MOUSE STUFF
    static getMouse(mouseButton) {
        return Mouse.isButtonDown(mouseButton);
    }
    static getMouseDown(mouseButton) {
        return Input.getMouse(mouseButton) && !Input.lastMouse[mouseButton];
    }
    static getMouseUp(mouseButton) {
        return !Input.getMouse(mouseButton) && Input.lastMouse[mouseButton];
    }
    static getMouseLock() {
        return Mouse.isLocked;
    }
    static getMousePosition() {

        let res;

        Input.previousDeltaPos = Input.currentDeltaPos;
        Input.currentDeltaPos = new Vec2(Mouse.getX(), Mouse.getY());

        if (Input.previousDeltaPos.equals(Input.currentDeltaPos)) {
            res = new Vec2(0, 0);
        } else {
            res = Input.currentDeltaPos;
        }
        return res;
    }
}

Input.lastKeys = [];
Input.lastMouse = [];

Input.currentDeltaPos = new Vec2();
Input.previousDeltaPos = new Vec2();

export default Input;