import Resources from "./Resources.js";

export default class GizmoEngine {
  static FRAMES_PER_SECOND = 120;
  static #initialized = false;

  static #scenes = [];
  static #components = [];
  static #intervalID = null;
  static #tick = 0;

  static isRunning = false;

  static async init() {
    if (this.#initialized) return;
    this.#initialized = true;
    await Resources.init();

    return this;
  }

  static start() {
    if (this.#intervalID) return;
    const loop = () => {
      this.#tick++;
      this.#scenes.forEach((scene) => {
        scene.update(this.#tick);
      });
      this.#components.forEach((comp) => {
        comp.update();
      });
    };

    this.#intervalID = setInterval(loop, 1000 / this.FRAMES_PER_SECOND);
    this.isRunning = true;
  }
  static pause() {
    if (!this.#intervalID) return;
    clearInterval(this.#intervalID);
    this.#intervalID = null;
    this.isRunning = false;
  }
  static stop() {
    this.pause();
    this.#tick = 0;
  }

  static addScene(scene) {
    this.#scenes.push(scene);
  }

  static addComponent({ component }) {
    this.#components.push(component);
  }
}
