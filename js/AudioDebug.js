class AudioDebug {

    constructor(target, callback) {

        this.target = target;
        this.callback = callback;

        this.debugCanvas = document.getElementById("equalizer");
        this.debugCtx = this.debugCanvas.getContext("2d");

        this.w =  this.debugCanvas.width;
        this.h =  this.debugCanvas.height;
        this.numBars = 1024;
    }

    clear() {

        this.debugCtx.clearRect(0, 0, this.w, this.h); // Clear the canvas
    }


    debugSound(trackID, barID=0) {

        this.clear();

        var bar_x;
        var bar_w;
        var bar_h;
        for (var i = 0; i < this.numBars; i++) {
            bar_x = i * 3;
            bar_w = 2;
            bar_h = -((this.target.getFrequency(trackID, i) * 120) / 2);
            if(i === barID) {
                this.debugCtx.fillStyle = "#00c229";
                this.debugCtx.fillRect(bar_x, this.h, bar_w, bar_h);
            } else {
                this.debugCtx.fillStyle = "#ff2828";
                this.debugCtx.fillRect(bar_x, this.h, bar_w, bar_h);
            }
        }
        this.callback(this.target.getFrequency(trackID, barID));
    }
}