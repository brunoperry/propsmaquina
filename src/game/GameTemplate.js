import Game from "./Game.js";
import Camera3D from "../components/Camera3D.js";
import GameObject from "./GameObject.js";
import Resources from "../Resources.js";
import Vec4 from "../core/math/Vec4.js";

class GameTemplate extends Game {

    constructor(data) {
        super(data);

        this.carObject = new GameObject({
            mesh: Resources.getMesh(0).clone(),
            texture: Resources.getTexture(0).clone(),
            rad: 1
        });
    }

    /**
     * OVERRIDES
     */
    setRenderer(renderer) {
        super.setRenderer(renderer);
        this.camera = new Camera3D(Camera3D.FOV, this.renderer.getWidth() / this.renderer.getHeight());
    }
    update(tick) {
        super.update(tick);
    }

    render(tick) {

        this.renderer.clear(0x00);
        this.renderer.clearDepthBuffer();

        this.carObject.setPos(new Vec4(0, 0, 1));
        this.carObject.setRotate(new Quater());
        this.carObject.update(this.renderer, this.camera.getViewProjection(), tick)
    }
}

export default GameTemplate;