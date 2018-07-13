class Texture {
    //Array of bitmaps
    constructor(data) {

        this.id = data.id;
        this.name = data.name;
        this.bitmap = data.bitmap;
    }
    
    setRadiance(rad) {

        this.bitmap.setRadiance(rad)
    }

    useLight(value) {
        this.bitmap.useLight = value;
    }

    clone() {
        return new Texture({
            id: this.id,
            name: this.name,
            bitmap: this.bitmap.clone()
        });
    }
}

export default Texture;