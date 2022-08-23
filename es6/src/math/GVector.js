export default class GVector {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  length() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  equals(vec) {
    return this.x === vec.x && this.y === vec.y && this.z === vec.z;
  }

  max() {
    return Math.max(Math.max(this.x, this.y), Math.max(this.z, this.w));
  }

  dot(r) {
    return this.x * r.x + this.y * r.y + this.z * r.z + this.w * r.w;
  }

  cross(vec) {
    return new GVector(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x
    );
  }

  clone() {
    return new GVector(this.x, this.y, this.z, this.w);
  }

  lerp(dest, lerpFactor) {
    if (lerpFactor > 1) {
      return dest;
    } else {
      return dest.subtractVec(this).multiply(lerpFactor).addVec(this);
    }
  }

  normalized() {
    const length = this.length();
    return new GVector(
      this.x / length,
      this.y / length,
      this.z / length,
      this.w / length
    );
  }

  rotate(axis, angle) {
    const cosAngle = Math.cos(-angle);
    return this.cross(axis.mul(Math.sin(-angle))).add(
      this.mul(cosAngle).add(axis.mul(this.dot(axis.mul(1 - cosAngle))))
    );
  }

  //Quaternion
  rotateQuat(rotation) {
    const w = rotation.multiplyVec(this).multiplyQuat(rotation.conjugate());
    return new GVector(w.getX(), w.getY(), w.getZ(), 1.0);
  }

  add(r) {
    return new GVector(this.x + r, this.y + r, this.z + r, this.w + r);
  }

  addVec(r) {
    return new GVector(this.x + r.x, this.y + r.y, this.z + r.z, this.w + r.w);
  }

  subtract(r) {
    return new GVector(this.x - r, this.y - r, this.z - r, this.w - r);
  }

  subtractVec(r) {
    return new GVector(this.x - r.x, this.y - r.y, this.z - r.z, this.w - r.w);
  }

  subtractQuat(r) {
    return new GVector(this.x - r.x, this.y - r.y, this.z - r.z, this.w - r.w);
  }

  multiply(r) {
    return new GVector(this.x * r, this.y * r, this.z * r, this.w * r);
  }

  multiplyVec(r) {
    return new GVector(this.x * r.x, this.y * r.y, this.z * r.z, this.w * r.w);
  }

  divide(r) {
    return new GVector(this.x / r, this.y / r, this.z / r, this.w / r);
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getZ() {
    return this.z;
  }
  getW() {
    return this.w;
  }

  //static
  static up() {
    return new GVector(0, 1, 0);
  }
  static right() {
    return new GVector(1, 0, 0);
  }
  static forward() {
    return new GVector(0, 0, 1);
  }
  static all() {
    return new GVector(1, 1, 1);
  }
  static addVecs(vecA, vecB) {
    return new GVector(
      vecA.x + vecB.x,
      vecA.y + vecB.y,
      vecA.z + vecB.z,
      vecA.w + vecB.w
    );
  }

  static subtractVecs(vecA, vecB) {
    return new GVector(
      vecA.x - vecB.x,
      vecA.y - vecB.y,
      vecA.z - vecB.z,
      vecA.w - vecB.w
    );
  }

  static multiplyVecByNum(vec, n) {
    return new GVector(vec.x * n, vec.y * n, vec.z * n, vec.w * n);
  }
  static lerpVecs(startP, endP, percent) {
    if (percent >= 1) {
      return endP;
    }
    return GVector.subtractVecs(endP, startP).multiply(percent).addVec(startP);
  }

  static nLerp(start, end, percent) {
    if (percent >= 1) {
      return end;
    }
    return GVector.lerpVecs(start, end, percent).normalized();
  }
  //params: GVector, GVector / returns: GVector
  static distance(vecA, vecB) {
    return Math.sqrt(
      Math.pow(vecA.x - vecB.x, 2) +
        Math.pow(vecA.y - vecB.y, 2) +
        Math.pow(vecA.z - vecB.z, 2)
    );
  }
  static greaterOrEqualThan(vecA, vecB) {
    return vecA.x >= vecB.x && vecA.y >= vecB.y && vecA.z >= vecB.z;
  }
  static crossVecs(a, b) {
    return new GVector(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
}
