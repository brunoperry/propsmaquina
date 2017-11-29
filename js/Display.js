class Display {

    constructor(data) {

        this.canvasContainer = data.view;
        this.reset(data);

        this.isRecording = false;
        this.videoImages = [];
    }

    swapBuffers() {
        
                
        if(this.isRecording) {

            let instance = this;
            this.frame.toBlob(function(blob) {
                instance.videoImages.push(blob);
            }, "image/jpeg");
        }
        
        this.displayImage.data.set(this.frameBuffer.components);
        this.graphics.putImageData(this.displayImage, 0, 0);
    }

    reset(data) {

        this.canvasContainer.innerHTML = "";

        this.frame = null;
        this.graphics = null;
        this.frameBuffer = null;

        this.frame = document.createElement("canvas");
        this.frame.width = data.w;
        this.frame.height = data.h;

        if(data.className) {
            this.frame.className = data.className;
        }
        this.canvasContainer.appendChild(this.frame);

        this.graphics = this.frame.getContext("2d"); 
        this.frameBuffer = new RenderContext(this.frame.width, this.frame.height);
        this.frameBuffer.clear(0X00);

        this.displayImage = new ImageData(this.frame.width, this.frame.height);

        this.videoImages = [];
    }

    getCanvas() {
        return this.frame;
    }

    setScreenRecord(value) {
        this.isRecording = value;
    }

    getScreenRecordingData() {

        // let blobs = [];

        // let f = document.createElement("canvas");
        // f.width = this.frame.width;
        // f.height = this.frame.height;
        // let = f.getContext("2d"); 

        // var id = window.setInterval(function() {


        // }, speed);
        return this.videoImages;
    }
}

Display.Options = {

    SHOW_HIDE_WIREFRAME: 0
}

Display.Quality = [
    {
        w: 240,
        h: 180,
        className: "shit"
    },
    {
        w: 480,
        h: 320,
        className: "fair"
    },
    {
        w: 800,
        h: 600,
        className: "cool"
    }
];