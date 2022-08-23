import Utils from "../Utils.js";
import GVector from "./GVector.js";

export default class GMatrix {
  constructor() {
    this.m = [[], [], [], []];
    this.identity();
  }

  identity() {
    this.m[0][0] = 1;
    this.m[0][1] = 0;
    this.m[0][2] = 0;
    this.m[0][3] = 0;
    this.m[1][0] = 0;
    this.m[1][1] = 1;
    this.m[1][2] = 0;
    this.m[1][3] = 0;
    this.m[2][0] = 0;
    this.m[2][1] = 0;
    this.m[2][2] = 1;
    this.m[2][3] = 0;
    this.m[3][0] = 0;
    this.m[3][1] = 0;
    this.m[3][2] = 0;
    this.m[3][3] = 1;

    return this;
  }

  screenSpaceTransform(halfW, halfH) {
    this.m[0][0] = halfW;
    this.m[0][1] = 0;
    this.m[0][2] = 0;
    this.m[0][3] = halfW - 0.5;
    this.m[1][0] = 0;
    this.m[1][1] = -halfH;
    this.m[1][2] = 0;
    this.m[1][3] = halfH - 0.5;
    this.m[2][0] = 0;
    this.m[2][1] = 0;
    this.m[2][2] = 1;
    this.m[2][3] = 0;
    this.m[3][0] = 0;
    this.m[3][1] = 0;
    this.m[3][2] = 0;
    this.m[3][3] = 1;

    return this;
  }

  perspective(fov, aspectRatio, zNear, zFar) {
    const tanHalfFOV = Math.tan(fov / 2);
    const zRange = zNear - zFar;

    this.m[0][0] = 1 / (tanHalfFOV * aspectRatio);
    this.m[0][1] = 0;
    this.m[0][2] = 0;
    this.m[0][3] = 0;
    this.m[1][0] = 0;
    this.m[1][1] = 1 / tanHalfFOV;
    this.m[1][2] = 0;
    this.m[1][3] = 0;
    this.m[2][0] = 0;
    this.m[2][1] = 0;
    this.m[2][2] = (-zNear - zFar) / zRange;
    this.m[2][3] = (2 * zFar * zNear) / zRange;
    this.m[3][0] = 0;
    this.m[3][1] = 0;
    this.m[3][2] = 1;
    this.m[3][3] = 0;

    return this;
  }

  multiply(r) {
    let res = new GMatrix();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        res.set(
          i,
          j,
          this.m[i][0] * r.get(0, j) +
            this.m[i][1] * r.get(1, j) +
            this.m[i][2] * r.get(2, j) +
            this.m[i][3] * r.get(3, j)
        );
      }
    }

    return res;
  }

  translation(x, y, z) {
    this.m[0][0] = 1;
    this.m[0][1] = 0;
    this.m[0][2] = 0;
    this.m[0][3] = x;
    this.m[1][0] = 0;
    this.m[1][1] = 1;
    this.m[1][2] = 0;
    this.m[1][3] = y;
    this.m[2][0] = 0;
    this.m[2][1] = 0;
    this.m[2][2] = 1;
    this.m[2][3] = z;
    this.m[3][0] = 0;
    this.m[3][1] = 0;
    this.m[3][2] = 0;
    this.m[3][3] = 1;

    return this;
  }

  rotation(x, y, z) {
    let rx = new GMatrix();
    let ry = new GMatrix();
    let rz = new GMatrix();

    rz.m[0][0] = Math.cos(z);
    rz.m[0][1] = -Math.sin(z);
    rz.m[0][2] = 0;
    rz.m[0][3] = 0;
    rz.m[1][0] = Math.sin(z);
    rz.m[1][1] = Math.cos(z);
    rz.m[1][2] = 0;
    rz.m[1][3] = 0;
    rz.m[2][0] = 0;
    rz.m[2][1] = 0;
    rz.m[2][2] = 1;
    rz.m[2][3] = 0;
    rz.m[3][0] = 0;
    rz.m[3][1] = 0;
    rz.m[3][2] = 0;
    rz.m[3][3] = 1;

    rx.m[0][0] = 1;
    rx.m[0][1] = 0;
    rx.m[0][2] = 0;
    rx.m[0][3] = 0;
    rx.m[1][0] = 0;
    rx.m[1][1] = Math.cos(x);
    rx.m[1][2] = -Math.sin(x);
    rx.m[1][3] = 0;
    rx.m[2][0] = 0;
    rx.m[2][1] = Math.sin(x);
    rx.m[2][2] = Math.cos(x);
    rx.m[2][3] = 0;
    rx.m[3][0] = 0;
    rx.m[3][1] = 0;
    rx.m[3][2] = 0;
    rx.m[3][3] = 1;

    ry.m[0][0] = Math.cos(y);
    ry.m[0][1] = 0;
    ry.m[0][2] = -Math.sin(y);
    ry.m[0][3] = 0;
    ry.m[1][0] = 0;
    ry.m[1][1] = 1;
    ry.m[1][2] = 0;
    ry.m[1][3] = 0;
    ry.m[2][0] = Math.sin(y);
    ry.m[2][1] = 0;
    ry.m[2][2] = Math.cos(y);
    ry.m[2][3] = 0;
    ry.m[3][0] = 0;
    ry.m[3][1] = 0;
    ry.m[3][2] = 0;
    ry.m[3][3] = 1;

    this.m = rz.multiply(ry.multiply(rx)).getM();

    return this;
  }

  //GVector, GVector
  rotationFU(forward, up) {
    const f = forward.normalized();
    const tr = GVector.crossVecs(up.normalized(), f);
    const u = GVector.crossVecs(f, tr);

    return this.rotationFUR(f, u, tr);
  }

  //GVector, GVector, GVector
  rotationFUR(forward, up, right) {
    this.m[0][0] = right.x;
    this.m[0][1] = right.y;
    this.m[0][2] = right.z;
    this.m[0][3] = 0;
    this.m[1][0] = up.x;
    this.m[1][1] = up.y;
    this.m[1][2] = up.z;
    this.m[1][3] = 0;
    this.m[2][0] = forward.x;
    this.m[2][1] = forward.y;
    this.m[2][2] = forward.z;
    this.m[2][3] = 0;
    this.m[3][0] = 0;
    this.m[3][1] = 0;
    this.m[3][2] = 0;
    this.m[3][3] = 1;

    return this;
  }

  //float, float, float
  scale(x, y, z) {
    this.m[0][0] = x;
    this.m[0][1] = 0;
    this.m[0][2] = 0;
    this.m[0][3] = 0;
    this.m[1][0] = 0;
    this.m[1][1] = y;
    this.m[1][2] = 0;
    this.m[1][3] = 0;
    this.m[2][0] = 0;
    this.m[2][1] = 0;
    this.m[2][2] = z;
    this.m[2][3] = 0;
    this.m[3][0] = 0;
    this.m[3][1] = 0;
    this.m[3][2] = 0;
    this.m[3][3] = 1;

    return this;
  }

  //params: vec4, returns: GVector
  transform(r) {
    return new GVector(
      this.m[0][0] * r.x +
        this.m[0][1] * r.y +
        this.m[0][2] * r.z +
        this.m[0][3] * r.w,
      this.m[1][0] * r.x +
        this.m[1][1] * r.y +
        this.m[1][2] * r.z +
        this.m[1][3] * r.w,
      this.m[2][0] * r.x +
        this.m[2][1] * r.y +
        this.m[2][2] * r.z +
        this.m[2][3] * r.w,
      this.m[3][0] * r.x +
        this.m[3][1] * r.y +
        this.m[3][2] * r.z +
        this.m[3][3] * r.w
    );
  }

  static fromQuaternionTranslationScale(q, v, s) {
    // Quaternion math
    const x = q.x,
      y = q.y,
      z = q.z,
      w = q.w,
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,
      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,
      sx = s.x,
      sy = s.y,
      sz = s.z;

    let out = [[], [], []];

    out[0][0] = (1 - (yy + zz)) * sx;
    out[0][1] = (xy + wz) * sx;
    out[0][2] = (xz - wy) * sx;
    out[0][3] = 0;
    out[1][0] = (xy - wz) * sy;
    out[1][1] = (1 - (xx + zz)) * sy;
    out[1][2] = (yz + wx) * sy;
    out[1][3] = 0;
    out[2][0] = (xz + wy) * sz;
    out[2][1] = (yz - wx) * sz;
    out[2][2] = (1 - (xx + yy)) * sz;
    out[2][3] = 0;
    out[3][0] = v.x;
    out[3][1] = v.y;
    out[3][2] = v.z;
    out[3][3] = 1;

    return out;
  }

  //GETTERS SETTERS
  get(x, y) {
    return this.m[x][y];
  }
  getM() {
    let res = [[], [], [], []];
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) res[i][j] = this.m[i][j];
    return res;
  }
  setM(m) {
    this.m = m;
  }
  set(x, y, value) {
    this.m[x][y] = value;
  }

  static perspective(fov, aspectRatio, zNear, zFar) {
    let out = new GMatrix();

    const tanHalfFOV = Math.tan(Utils.toRadians(fov) / 2);
    const zRange = zNear - zFar;

    out.m[0][0] = 1 / (tanHalfFOV * aspectRatio);
    out.m[0][1] = 0;
    out.m[0][2] = 0;
    out.m[0][3] = 0;
    out.m[1][0] = 0;
    out.m[1][1] = 1 / tanHalfFOV;
    out.m[1][2] = 0;
    out.m[1][3] = 0;
    out.m[2][0] = 0;
    out.m[2][1] = 0;
    out.m[2][2] = (-zNear - zFar) / zRange;
    out.m[2][3] = (2 * zFar * zNear) / zRange;
    out.m[3][0] = 0;
    out.m[3][1] = 0;
    out.m[3][2] = 1;
    out.m[3][3] = 0;

    return out;
  }
}
