import Camera from "../components/Camera.js";
import Resources from "../core/Resources.js";
import Display from "../rendering/Display.js";

export default class Scene {
  #display;
  camera;

  #objects3D = [];
  numObjects = this.#objects3D.length;

  constructor() {
    this.#display = new Display(Resources.getTexture("map"));
    this.camera = new Camera({
      aspectRatio: this.#display.width / this.#display.height,
    });
  }

  update(tick) {
    const vp = this.camera.getViewProjection();
    for (let i = 0; i < this.numObjects; i++) {
      this.#display.update(this.#objects3D[i].update(vp, tick));
    }
  }

  addObject3D(obj3D) {
    this.#objects3D.push(obj3D);
    this.numObjects = this.#objects3D.length;
  }
  removeObject3D(obj3DID) {
    let out = [];
    for (let i = 0; i < this.numObjects; i++) {
      const obj = this.#objects3D[i];
      if (obj.mesh.name !== obj3DID) out.push(obj);
    }
    this.#objects3D = out;
    this.numObjects = this.#objects3D.length;
  }
}
