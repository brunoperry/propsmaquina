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

    /** DEBUG START */
    // for (let i = 0; i < 10; i++) {
    //   this.addObject3D(
    //     new Object3D({
    //       mesh: Resources.getMesh("cube"),
    //       texture: Resources.getTexture("map"),
    //     })
    //   );
    // }
    /** DEBUG END  */
    this.addObject3D(this.#cube);
  }

  update(tick) {
    this.#cube.translate(new GVector(0, 0, -tick));
    super.update(tick);
  }
}
