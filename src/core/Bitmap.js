import Color from "./Color.js";

class Bitmap {

    constructor(data) {

        this.width = data.width;
        this.height = data.height;
        this.radiance = 1;
        this.name = data.name; data.name ? this.name = data.name : this.name = "no_name";

        this.useLight = true;

        if(!data.imgData) {
            this.components = new Uint8ClampedArray(this.width * this.height * 4);
        } else {
            this.components = data.imgData;
        } 

        this.imageData = new ImageData(this.components, this.width, this.height);
        this.imageDataInverted = null;
    }

    clone() {

        var dst = new ImageData(this.width, this.height);
        dst.data.set(this.components);
        
        return new Bitmap({
            width: this.width, 
            height: this.height,
            imgData: dst.data,
            name: this.name
        });
    }

    clear(shade) {
        this.components.fill(shade);
    }

    drawPixel(x, y, r, g, b, a) {


        var index = (x + y * this.width) * 4;

        this.components[index    ] = r;
        this.components[index + 1] = g;
        this.components[index + 2] = b;
        this.components[index + 3] = a;
    }

    //params: int, int, int, int, Bitmap, float
    copyPixel(destX, destY, srcX, srcY, src, lightAmt) {

        var destIndex = parseInt(destX + destY * this.width) * 4;
        var srcIndex = parseInt(srcX + srcY * src.getWidth()) * 4;
        var color = new Color(
            (src.getComponent(srcIndex)     & 0xff) * lightAmt,
            (src.getComponent(srcIndex + 1) & 0xff) * lightAmt,
            (src.getComponent(srcIndex + 2) & 0xff) * lightAmt,
            src.getComponent(srcIndex + 3)
        );
        

        this.components[destIndex    ] = color.r;
        this.components[destIndex + 1] = color.g;
        this.components[destIndex + 2] = color.b;
        this.components[destIndex + 3] = color.a;
    }

    // GETTERS SETTERS
    getWidth() { return this.width; }
    getHeight() { return this.height; }
    getComponent(index) { return this.components[index]; }
    getRadiance() { return this.radiance; }
    setRadiance(rad) { this.radiance = rad; }
}

// Bitmap.Modes = {
//     OPAQUE: 0, 
//     TRANSPARENT: 1
// }

export default Bitmap