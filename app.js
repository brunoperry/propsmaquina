import Resources from "./src/Resources.js";
import GizmoEngine from "./src/GizmoEngine.js";
import Game from "./src/Game.js";

let gizmoEngine = null;

window.onload = (event) => {

    gizmoEngine = new GizmoEngine({
        resourcesURL: "resources.json",
        callback: onGizmoEngine
    });
}

const onGizmoEngine = (event) => {

    switch(event.action) {

        case GizmoEngine.Actions.LOADING_DATA:
        break;

        case GizmoEngine.Actions.DATA_LOADED:

        const gizmoGame = new Game();
        gizmoGame.setData("game.json").
        then(game => {
            start(game);
        });
        break;

        case GizmoEngine.Actions.RUNNING:
        break;

        case GizmoEngine.Actions.PAUSED:
        break;
    }
}

const start = (game) => {

    gizmoEngine.setGame(game);
    gizmoEngine.run();
}