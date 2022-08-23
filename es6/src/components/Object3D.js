import GQuaternion from "../math/GQuaternion.js";
import GVector from "../math/GVector.js";
import Display from "../rendering/Display.js";
import Transform from "./Transform.js";

export default class Object3D extends Transform {
  #mesh;

  visible = true;

  constructor({ mesh, texture }) {
    super();
    this.#mesh = mesh;
    this.#mesh.setTexture(texture);

    this.reset();
  }

  update(viewPerspective, tick) {
    if (!this.visible) return;

    const viewModel = this.getTransformation();
    return this.#mesh.transform({
      mvp: viewPerspective.multiply(viewModel),
      transform: viewModel,
      tick: tick,
    });
  }

  reset() {
    this.position = new GVector();
    this.rotation = new GQuaternion();
    this.scale = new GVector();
  }

  get name() {
    return this.#mesh.name;
  }

  get texture() {
    return this.#mesh.texture;
  }
}
