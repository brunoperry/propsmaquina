import { Renderer } from "./Renderer.js";

export default class Display {
  #canvas;
  #graphics;
  #frameBuffer;
  #renderer = null;

  constructor() {
    this.#canvas = document.querySelector("canvas");
    this.#graphics = this.#canvas.getContext("2d");
    this.reset();

    this.#renderer.drawPixel(10, 10, 255, 0, 0, 255);
    this.swapBuffers();
  }

  #setupLayout() {
    let dim = this.#canvas.getBoundingClientRect();
    let styleToFix = this.#canvas.parentElement.style;

    styleToFix.width = `${dim.width}px`;
    styleToFix.height = `${dim.height}px`;
  }

  update(tris) {
    this.clear();
    this.#renderer.drawTriangles(tris);
    this.swapBuffers();
  }

  swapBuffers() {
    this.#frameBuffer.data.set(this.#renderer.components);
    this.#graphics.putImageData(this.#frameBuffer, 0, 0);
  }

  clear() {
    this.#renderer.clear(0x00);
    this.#renderer.clearDepthBuffer();
  }

  reset() {
    this.#setupLayout();
    this.#renderer = new Renderer(this.#canvas.width, this.#canvas.height);
    this.#renderer.clear(0x00);
    this.#frameBuffer = new ImageData(this.#canvas.width, this.#canvas.height);
  }

  set width(val) {
    this.#canvas.width = val;
  }
  get width() {
    return this.#canvas.width;
  }

  set height(val) {
    this.#canvas.height = val;
  }
  get height() {
    return this.#canvas.height;
  }
}
