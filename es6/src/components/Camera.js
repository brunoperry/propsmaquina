import GMatrix from "../math/GMatrix.js";
import PVector from "../math/GVector.js";
import Transform from "./Transform.js";

export default class Camera {
  constructor({ fov = 70, aspectRatio = 1.3, zNear = 0.1, zFar = 1000 }) {
    this.transform = new Transform();
    this.projection = GMatrix.perspective(fov, aspectRatio, zNear, zFar);
  }

  reset() {
    this.transform = new Transform();
  }

  getViewProjection() {
    //Mat4
    let cameraRotation = this.transform
      .getTransformedRot()
      .conjugate()
      .toRotationMatrix();

    //Vec4
    let cameraPos = this.transform.getTransformedPos().multiply(-1);

    //Mat4
    let cameraTranslation = new GMatrix().translation(
      cameraPos.x,
      cameraPos.y,
      cameraPos.z
    );

    return this.projection.multiply(cameraRotation.multiply(cameraTranslation));
  }

  //Input, float
  updateInput(input, delta) {
    // Speed and rotation amounts are hardcoded here.
    // In a more general system, you might want to have them as variables.
    //floats
    const sensitivityX = 2.66 * delta;
    const sensitivityY = 2.0 * delta;
    const movAmt = 5.0 * delta;

    switch (input.getKey()) {
      case Input.Key.W:
        this.move(this.transform.getRot().getForward(), movAmt);
        break;
      case Input.Key.A:
        this.move(this.transform.getRot().getLeft(), movAmt);
        break;
      case Input.Key.S:
        this.move(this.transform.getRot().getForward(), -movAmt);
        break;
      case Input.Key.D:
        this.move(this.transform.getRot().getRight(), movAmt);
        break;
      case Input.Key.RIGHT:
        this.rotate(Camera.Y_AXIS, sensitivityX);
        break;
      case Input.Key.LEFT:
        this.rotate(Camera.Y_AXIS, -sensitivityX);
        break;
      case Input.Key.DOWN:
        this.rotate(this.transform.getRot().getRight(), sensitivityY);
        break;
      case Input.Key.UP:
        this.rotate(this.transform.getRot().getRight(), -sensitivityY);
        break;
    }
  }

  moveTo(to, tick) {
    this.transform = transform.setPos(transform.position.lerp(to, tick));
    if (this.transform.position >= to.z) {
      this.transform.position.z = to.z;
      return;
    }
  }

  move(pos) {
    this.transform = new Transform(pos, this.rotation, this.scale);
  }

  //Vec4, float
  rotate(axis, angle) {
    this.transform = this.transform.rotate(
      new Quaternion({
        type: Quaternion.Type.INIT_VEC_ANGLE,
        vec: axis,
        angle: angle,
      })
    );
  }

  lookAt(point, up) {
    this.transform = this.transform.lookAt(point, up);
  }

  //returns Transform
  getTransform() {
    return this.transform;
  }
}

Camera.Y_AXIS = new PVector(0, 1, 0);
