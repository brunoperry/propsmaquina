import GVector from "../math/GVector.js";

export default class Vertex {
  //GVector, GVector, GVector
  constructor(pos, textCoords = new GVector(), normal = new GVector()) {
    this.position = pos;
    this.textCoords = textCoords;
    this.normal = normal;
  }

  clone() {
    return new Vertex(this.position, this.textCoords, this.normal);
  }

  //param: Mat4, Mat4 returns: Vertex
  transform(positionTransform, normalTransform) {
    return new Vertex(
      positionTransform.transform(this.position),
      this.textCoords,
      normalTransform.transform(this.normal)
    );
  }

  perspectiveDivide() {
    var v = new GVector(
      this.position.x / this.position.w,
      this.position.y / this.position.w,
      this.position.z / this.position.w,
      this.position.w
    );

    return new Vertex(v, this.textCoords, this.normal);
  }

  isInsideViewFrustum() {
    return (
      Math.abs(this.position.x) <= Math.abs(this.position.w) &&
      Math.abs(this.position.y) <= Math.abs(this.position.w) &&
      Math.abs(this.position.z) <= Math.abs(this.position.w)
    );
  }

  triangleAreaTimesTwo(b, c) {
    var x1 = b.get(0) - this.position.x;
    var y1 = b.get(1) - this.position.y;

    var x2 = c.get(0) - this.position.x;
    var y2 = c.get(1) - this.position.y;

    return x1 * y2 - x2 * y1;
  }

  //params: GVector, float returns: Vertex
  lerp(other, lerpAmt) {
    return new Vertex(
      this.position.lerp(other.getPosition(), lerpAmt),
      this.textCoords.lerp(other.getTexCoords(), lerpAmt),
      this.normal.lerp(other.getNormal(), lerpAmt)
    );
  }

  get(i) {
    switch (i) {
      case 0:
        return this.position.x;
      case 1:
        return this.position.y;
      case 2:
        return this.position.z;
      case 3:
        return this.position.w;
    }
  }
  set(i, val) {
    switch (i) {
      case 0:
        this.position.x = val;
        break;
      case 1:
        this.position.y = val;
        break;
      case 2:
        this.position.z = val;
        break;
      case 3:
        this.position.w = val;
        break;
    }
  }

  // GETTERS SETTERS
  getPosition() {
    return this.position;
  }
  setPosition(pos) {
    this.position = pos;
  }
  getTexCoords() {
    return this.textCoords;
  }
  getNormal() {
    return this.normal;
  }

  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  get z() {
    return this.position.z;
  }
}
