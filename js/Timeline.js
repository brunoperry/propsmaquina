class Timeline {

    constructor(data) {

        this.keyframes = data.keyframes;
        this.totalKeyframes = this.keyframes.length;
        this.callback = data.callback;

        this.creationTime = Timeline.time();
        this.startTime = Timeline.time();
        this.previsousTime = null;

        this.isRunning = false;


        this.startedAt = 0;
        this.pausedAt = 0;

        this.currentKeyFrame = -1;
        this.currentTime;

        this.delta = 0;
        this.tick = 0;
    }

    update() {
        this.currentTime = Timeline.time() - this.startedAt;
        if(this.previsousTime) this.delta = this.currentTime - this.previsousTime;
        this.previsousTime = this.currentTime;

        this.tick += this.delta / 1;

        this.getKeyframe();
    }

    play() {
        var offset = Math.abs(this.pausedAt);
        this.startedAt = Timeline.time() - offset;

        this.pausedAt = 0;
        this.isRunning = true;
    }

    pause() {

        var elapsed = Timeline.time() - this.startedAt;
        this.pausedAt = 0;
        this.startedAt = 0;
        this.pausedAt = elapsed;
        this.isRunning = false;
    }

    getKeyframe() {

        var k;
        var sTick = this.tick * 1000;
        var lght = this.keyframes.length;

        var i = 0;
        for(i; i < this.totalKeyframes - 1; i++) {
            k = this.keyframes[i];
            if(i + 1 < this.totalKeyframes) {
                if(sTick >= k && sTick <= this.keyframes[i + 1] && this.currentKeyFrame !== k) {

                    this.currentKeyFrame = k;
                    this.callback(i);
                    return;
                }
            }
        }
    }

    gotoKeyframe(frame) {

        if(this.isRunning) {
            this.startedAt = this.creationTime + (this.keyframes[frame] / 1000);
        } else {
            this.pausedAt = this.creationTime + (this.keyframes[frame] / 1000);
        }
        this.previsousTime = null;
        this.delta = 0;
        this.tick = (this.keyframes[frame] / 1000);
    }


    static time() {

        return Date.now() / 1000;
    }
}