import Object3D from "../components/Object3D.js";
import Resources from "../core/Resources.js";
import GVector from "../math/GVector.js";
import Scene from "./Scene.js";

export default class TestScene extends Scene {
  #cube;
  constructor() {
    super();

    this.#cube = new Object3D({
      mesh: Resources.getMesh("cube"),
      texture: Resources.getTexture("map"),
    });
    this.addObject3D(this.#cube);
  }

  update(tick) {
    super.update(tick);

    console.log(-tick);
    this.#cube.translate(new GVector(0, 0, -tick));
  }
}
