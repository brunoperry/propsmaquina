class Keyboard {
    constructor() { }

    static create() {
        //KEYBOARD
        window.onkeyup = (event) => {
            Keyboard.keys[event.keyCode] = false;
        }
        window.onkeydown = (event) => {
            Keyboard.keys[e.keyCode] = true;
        }
    }

    static isKeyDown(keyCode) {
        return Keyboard.keys[keyCode] === true;
    }
}

Keyboard.Keys = {
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32,
    ESCAPE: 27
}

Keyboard.NUM_KEYCODES = 9;
Keyboard.keys = [];

export default Keyboard;