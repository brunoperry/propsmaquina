import RenderContext from "./RenderContext.js";

class Display {

    constructor(data) {

        this.canvas = null;
        this.context = null;
        this.frameBuffer = null;
        this.canvasContainer = data.view;
        this.reset(data);
    }

    swapBuffers() {
        
        this.displayImage.data.set(this.frameBuffer.components);
        this.context.putImageData(this.displayImage, 0, 0);
    }

    reset(data) {

        this.canvasContainer.innerHTML = "";


        this.canvas = document.createElement("canvas");
        this.canvas.width = data.width;
        this.canvas.height = data.height;

        this.canvasContainer.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d"); 
        this.frameBuffer = new RenderContext({
            width: this.canvas.width,
            height: this.canvas.height
        });
        this.frameBuffer.clear(0X00);

        this.displayImage = new ImageData(this.canvas.width, this.canvas.height);
    }
}

export default Display;