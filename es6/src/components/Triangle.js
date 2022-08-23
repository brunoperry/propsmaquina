import Vertex from "../math/Vertex.js";

export default class Triangle {
  a;
  b;
  c;
  texture;
  constructor(
    a = new Vertex(),
    b = new Vertex(),
    c = new Vertex(),
    texture = null
  ) {
    this.a = a;
    this.b = b;
    this.c = c;

    this.texture = texture;
  }

  transform(vp, m) {
    this.a.transform(vp, m);
    this.b.transform(vp, m);
    this.c.transform(vp, m);
  }

  get positions() {
    return [this.a.position, this.b.position, this.c.position];
  }

  get isInsideFrustrum() {
    return (
      this.a.isInsideViewFrustum() &&
      this.b.isInsideViewFrustum() &&
      this.c.isInsideViewFrustum()
    );
  }
}
