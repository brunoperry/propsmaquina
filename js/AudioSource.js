class AudioSource {

    constructor(id, audioContext, buffer) {

        this.id = id;
        this.buffer = buffer
        this.audioContext = audioContext;
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.9;
        this.gainNode = null;

        this.sourceNode = null;
        this.startedAt = 0;
        this.pausedAt = 0;
        this.playing = false;
    }

    setGainNode(gain) {

        this.gainNode = gain;
    }

    getFrequency(val) {

        var fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(fbc_array);

        return fbc_array[val] / 255;
    }

    play() {
        
        if(this.playing) return;

        var offset = this.pausedAt;

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.buffer;
        this.sourceNode.connect(this.gainNode);
        this.sourceNode.connect(this.analyser);
        this.sourceNode.start(0, offset);

        this.startedAt = Math.abs(this.audioContext.currentTime - offset);

        this.pausedAt = 0;
        this.playing = true;
    }

    pause() {

        var elapsed = this.audioContext.currentTime - this.startedAt;
        this.stop();
        this.pausedAt = elapsed;
    }

    stop() {

        if(!this.playing) return;

        if (this.playing) {          
            this.sourceNode.disconnect();
            this.sourceNode.stop(0);
            this.sourceNode = null;
        }
        this.pausedAt = 0;
        this.startedAt = 0;
        this.playing = false;
    }

    setTimeAt(time) {

        if(this.playing) {
            this.pause();
            this.pausedAt = time;
            this.play();
        } else {
            this.pausedAt = time;
        }
    }

    playAt(time) {

        this.pause();
        this.pausedAt = time / 1000;
    }
}