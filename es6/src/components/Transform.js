import GMatrix from "../math/GMatrix.js";
import GQuaternion from "../math/GQuaternion.js";
import PVector from "../math/GVector.js";

export default class Transform {
  //Vec4, Qauternion, Vec4
  position;
  rotation;
  scale;
  constructor(
    pos = new PVector(),
    rot = new GQuaternion(),
    scale = new PVector()
  ) {
    this.position = pos;
    this.rotation = rot;
    this.scale = scale;
  }

  clone() {
    return new Transform(this.position, this.rotation, this.scale);
  }

  //params: Vec4 returns: Transform
  translate(pos) {
    this.position = this.position.addVec(pos);
    // return new Transform(pos, this.rotation, this.scale);
  }

  //params: Quaternion / returns: Transform
  rotate(rotation) {
    return new Transform(
      this.position,
      rotation.multiplyQuat(this.rotation).normalized(),
      this.scale
    );
  }

  //params: Vec4 / returns: Transform
  setScale(scl) {
    return new Transform(this.position, this.rotation, scl);
  }

  //params: Vec4, Vec4 / returns: Transform
  lookAt(point, up) {
    return this.rotate(this.getLookAtRotation(point, up));
  }

  //Vec4, Vec4 / returns: Quaternion
  getLookAtRotation(point, up) {
    var mat = new GMatrix();
    var v = point.subtractVec(this.position).normalized();

    return new Quaternion({
      type: Quaternion.Type.INIT_MAT,
      mat: mat.rotationFU(v, up),
    });
  }

  //GMatrix
  getTransformation() {
    const translationMatrix = new GMatrix().translation(
      this.position.x,
      this.position.y,
      this.position.z
    );
    const rotationMatrix = this.rotation.toRotationMatrix();

    const scaleMatrix = new GMatrix().scale(
      this.scale.x,
      this.scale.y,
      this.scale.z
    );
    return translationMatrix.multiply(rotationMatrix.multiply(scaleMatrix));
  }

  getTransformedPos() {
    return this.position;
  }

  getTransformedRot() {
    return this.rotation;
  }

  getPos() {
    return this.position;
  }

  getRot() {
    return this.rotation;
  }

  getScale() {
    return this.scale;
  }
}
