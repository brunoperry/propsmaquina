class Texture {

    //Array of bitmaps
    constructor(data) {

        this.id = data.id;
        this.bmps = data.bmps;
        this.currentBmpIndex = 0;

        this.bmp = this.bmps[this.currentBmpIndex];

        this.bmps.length > 1 ? this.isAnim = true : this.isAnim = false;

        this.animID = null;
    }

    setMainTexture(texID) {

        this.currentBmpIndex = texID;
        this.bmp = this.bmps[this.currentBmpIndex];
    }

    play() {

        if(this.animID || this.bmps.length === 1) return;
        var instance = this;
        this.animID = window.setInterval(function() {
            instance.currentBmpIndex++;
            if(instance.currentBmpIndex >= instance.bmps.length) {
                instance.currentBmpIndex = 0;
            }
            instance.bmp = instance.bmps[instance.currentBmpIndex];
        }, 50);
    }
    stop() {

        if(!this.animID || this.bmps.length === 1) return;

        window.clearInterval(this.animID);
        this.animID = null;
    }
    
    setRadiance(rad) {

        this.bmp.setRadiance(rad)
    }

    useLight(value) {

        for(var i = 0; i < this.bmps.length; i++) {
            this.bmps[i].useLight = value;
        }
    }

    clone() {
        var copiedBmps = [];
        for(var i = 0; i < this.bmps.length; i++) {
            copiedBmps.push(this.bmps[i].clone());
        }
        return new Texture({
            id: this.id,
            bmps: copiedBmps
        });
    }
}