import Resources from "./src/Resources.js";
import GizmoEngine from "./src/GizmoEngine.js";
import GameTemplate from "./src/game/GameTemplate.js";

let gizmoEngine = null;

window.onload = (event) => {

    gizmoEngine = new GizmoEngine({
        resourcesURL: "resources.json",
        callback: onGizmoEngine
    });

    document.getElementById("play-pause-button").onclick = (event) => {
        onPlayPause(event.target);
    }
}

const onPlayPause = (elem) => {

    if(gizmoEngine.isRunning) {
        gizmoEngine.pause();
        elem.innerHTML = "RUN";
    } else {
        gizmoEngine.run();
        elem.innerHTML = "PAUSE";
    }
}

const onGizmoEngine = (event) => {

    switch(event.action) {

        case GizmoEngine.Actions.LOADING_DATA:
        break;

        case GizmoEngine.Actions.DATA_LOADED:

        const gizmoGame = new GameTemplate();
        gizmoGame.setData("game.json").
        then(game => {
            gizmoEngine.setGame(game);
            start();
        });
        break;

        case GizmoEngine.Actions.RUNNING:
        break;

        case GizmoEngine.Actions.PAUSED:
        break;
    }
}

const start = () => {

    gizmoEngine.run();
}