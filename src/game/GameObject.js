import Transform from "../components/Transform.js";
import Vec4 from "../core/math/Vec4.js";
import Quaternion from "../core/math/Quaternion.js";

class GameObject {

    constructor(data, useLight=true) {

        this.mesh = data.mesh;
        this.texture = data.texture;

        if(data.rad !== undefined) {
            this.texture.setRadiance(data.rad);
        }
        else {
            this.texture.radiance = 1;
        }

        this.visible = true;
        this.texture.useLight(useLight);

        this.reset();
    }

    //params: Display, Mat4
    update(renderer, viewPerspective, tick) {

        if(!this.visible) return;

        // console.log(this.texture)
        this.mesh.draw( renderer,
                        viewPerspective,
                        this.transform.getTransformation(),
                        this.texture );
    }

    reset() {
        this.transform = new Transform(new Vec4(0,0,0), new Quaternion(), new Vec4(1,1,1));
    }

    setMainTexture(texID) {

        this.texture.setMainTexture(texID);
    }

    //params: Vec4
    setPos(pos) {
        this.transform = this.transform.setPos(pos);
    }
    getPos() {

        return this.transform.getPos();
    }

    //params: Quaternion
    /**
     * 
     * @param {Quaternion} rot 
     */
    setRotate(rot) {
        this.transform = this.transform.rotate(rot);
    }

    //params: Vec4
    setScale(scale) {
        this.transform = this.transform.setScale(scale);
    }

    get name() {
        return this.mesh.name;
    }

    setRadiance(rad) {
        this.texture.bmp.setRadiance(rad);
    }

    //params: Vec4, Vec4
    lookAt(dir, up) {
        this.transform = this.transform.lookAt(dir, up);
    }

}

export default GameObject;