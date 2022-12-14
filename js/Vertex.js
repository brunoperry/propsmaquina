class Vertex {
  //Vec4, Vec4, Vec4
  constructor(pos, textCoords, normal) {
    this.pos = pos;
    this.textCoords = textCoords;

    if (!textCoords) {
      this.textCoords = pos;
    } else {
      this.textCoords = textCoords;
    }
    if (!normal) {
      this.normal = pos;
    } else {
      this.normal = normal;
    }
  }

  clone() {
    return new Vertex(this.pos, this.textCoords, this.normal);
  }

  //param: Mat4, Mat4 returns: Vertex
  transform(transform, normalTransform) {
    return new Vertex(
      transform.transform(this.pos),
      this.textCoords,
      normalTransform.transform(this.normal)
    );
  }

  perspectiveDivide() {
    var v = new Vec4(
      this.pos.getX() / this.pos.getW(),
      this.pos.getY() / this.pos.getW(),
      this.pos.getZ() / this.pos.getW(),
      this.pos.getW()
    );

    return new Vertex(v, this.textCoords, this.normal);
  }

  isInsideViewFrustum() {
    return (
      Math.abs(this.pos.getX()) <= Math.abs(this.pos.getW()) &&
      Math.abs(this.pos.getY()) <= Math.abs(this.pos.getW()) &&
      Math.abs(this.pos.getZ()) <= Math.abs(this.pos.getW())
    );
  }

  triangleAreaTimesTwo(b, c) {
    var x1 = b.get(0) - this.pos.getX();
    var y1 = b.get(1) - this.pos.getY();

    var x2 = c.get(0) - this.pos.getX();
    var y2 = c.get(1) - this.pos.getY();

    return x1 * y2 - x2 * y1;
  }

  //params: Vec4, float returns: Vertex
  lerp(other, lerpAmt) {
    return new Vertex(
      this.pos.lerp(other.getPosition(), lerpAmt),
      this.textCoords.lerp(other.getTexCoords(), lerpAmt),
      this.normal.lerp(other.getNormal(), lerpAmt)
    );
  }

  get(i) {
    switch (i) {
      case 0:
        return this.pos.getX();
      case 1:
        return this.pos.getY();
      case 2:
        return this.pos.getZ();
      case 3:
        return this.pos.getW();
    }
  }
  set(i, val) {
    switch (i) {
      case 0:
        this.pos.x = val;
        break;
      case 1:
        this.pos.y = val;
        break;
      case 2:
        this.pos.z = val;
        break;
      case 3:
        this.pos.w = val;
        break;
    }
  }

  get toString() {
    return this.pos.toString;
  }

  // GETTERS SETTERS
  getPosition() {
    return this.pos;
  }
  setPosition(pos) {
    this.pos = pos;
  }
  getTexCoords() {
    return this.textCoords;
  }
  getNormal() {
    return this.normal;
  }
}
