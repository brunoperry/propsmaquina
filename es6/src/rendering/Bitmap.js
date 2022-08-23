import Color from "./Color.js";

export default class Bitmap {
  constructor({ width, height, data }) {
    this.width = width;
    this.height = height;

    !data
      ? (this.components = new Uint8ClampedArray(width * height * 4))
      : (this.components = data);

    this.imageData = new ImageData(this.components, width, height);
  }

  clone() {
    let dst = new ImageData(this.width, this.height);
    dst.data.set(this.components);

    return new Bitmap({
      width: this.width,
      height: this.height,
      data: dst.data,
    });
  }

  clear(shade) {
    this.components.fill(shade);
  }

  drawPixel(x, y, r, g, b, a) {
    const index = (x + y * this.width) * 4;
    this.components[index] = r;
    this.components[index + 1] = g;
    this.components[index + 2] = b;
    this.components[index + 3] = a;
  }

  //params: int, int, int, int, Bitmap, float
  copyPixel(destX, destY, srcX, srcY, src, lightAmt) {
    const destIndex = parseInt(destX + destY * this.width) * 4;
    const srcIndex = parseInt(srcX + srcY * src.width) * 4;
    let color = new Color(
      (src.getComponent(srcIndex) & 0xff) * lightAmt,
      (src.getComponent(srcIndex + 1) & 0xff) * lightAmt,
      (src.getComponent(srcIndex + 2) & 0xff) * lightAmt,
      src.getComponent(srcIndex + 3)
    );

    this.components[destIndex] = color.r;
    this.components[destIndex + 1] = color.g;
    this.components[destIndex + 2] = color.b;
    this.components[destIndex + 3] = color.a;
  }

  getComponent(index) {
    return this.components[index];
  }
}

Bitmap.Modes = {
  OPAQUE: 0,
  TRANSPARENT: 1,
};
