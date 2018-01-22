class FPS {

    constructor(data) {

        this.previousTime = Timeline.time();
        this.currentFPS = 0;
        this.label = data.view;
    }

    update(tick) {

        var now = Timeline.time();
        var currentFPS = Math.round(1000.0 * (now - this.previousTime));

        this.previousTime = now;

        this.label.innerHTML = "FPS: " + currentFPS;
    }
}