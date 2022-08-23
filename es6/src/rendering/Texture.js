export default class Texture {
  bitmap;
  constructor({ name, bitmap }) {
    this.name = name;
    this.bitmap = bitmap;
  }

  clone() {
    return this.bitmap.clone();
  }

  get width() {
    return this.bitmap.width;
  }
  get height() {
    return this.bitmap.height;
  }
}
