import Display from "./core/Display.js";
import Resources from "./Resources.js";
import Time from "./utils/Time.js";
import Input from "./input/Input.js";
import Keyboard from "./input/Keyboard.js";

class GizmoEngine {

    constructor(data) {

        this.callback = data.callback;
        if (!this.callback) throw new Error("No callback defined!");

        this.display = null;
        this.game = null;
        this.isRunning = false;

        this.callback({ action: GizmoEngine.Actions.LOADING_DATA });
        Resources.loadData(data.resourcesURL).then(result => {
            this.init();
        });
    }

    init() {
        this.display = new Display({
            view: document.getElementById("canvas-container"),
            width: 480,
            height: 320
        });
        this.target = this.display.frameBuffer;
        this.callback({ action: GizmoEngine.Actions.DATA_LOADED });
    }

    setGame(game) {

        this.game = game;
    }

    run() {

        this.isRunning = true;

        let frames = 0;
        let frameCounter = 0;
        const frameRate = 1.0 / 60;

        let instance = this;

        let lastTime = Time.getTime();
        let unprocessedTime = 0;

        let loop = (e) => {

            let render = false;

            let startTime = Time.getTime();
            let passedTime = startTime - lastTime;
            lastTime = startTime;

            unprocessedTime += (passedTime / Time.SECOND);
            frameCounter += passedTime;

            while (unprocessedTime > frameRate) {

                render = true;
                unprocessedTime -= frameRate;

                if (!this.isRunning) {
                    window.clearInterval(interID);
                }

                Time.setDelta(frameRate);

                Input.update();
                instance.game.update(Time.getDelta());

                if (Input.getKey(Keyboard.ESCAPE)) {
                    instance.pause();
                }

                if (frameCounter >= Time.SECOND) {
                    frames = 0;
                    frameCounter = 0;
                }
            }

            if (render) {
                instance.game.render(instance.target);
                frames++;
            }
        }

        let interID = window.setInterval(loop, 1);

        this.callback({ action: GizmoEngine.Actions.RUNNING });
        // this.cleanUp();
    }

    pause() {
        this.isRunning = false;
        this.callback({ action: GizmoEngine.Actions.PAUSED });
    }
}

GizmoEngine.Actions = {
    LOADING_DATA: "gizmoengineloadingdata",
    DATA_LOADED: "gizmoenginedataloaded",
    RUNNING: "gizmoenginerunning",
    PAUSED: "gizmoenginepaused"
}

export default GizmoEngine