class Camera {
  //params: Mat4
  constructor(projection) {
    //Transform
    this.transform = new Transform();
    this.projection = projection;
  }

  resetTarget(target) {
    this.projection = new Mat4().perspective(
      parseFloat(Utils.toRadians(70.0)),
      parseFloat(target.getWidth()) / parseFloat(target.getHeight()),
      0.1,
      1000.0
    );
  }

  reset() {
    this.transform = new Transform();
  }

  //PARAMS: float
  setPerspective(angle) {
    this.projection = new Mat4().perspective(
      parseFloat(Utils.toRadians(angle)),
      parseFloat(target.getWidth()) / parseFloat(target.getHeight()),
      0.1,
      1000.0
    );
  }

  getViewProjection() {
    //Mat4
    var cameraRotation = this.getTransform()
      .getTransformedRot()
      .conjugate()
      .toRotationMatrix();

    //Vec4
    var cameraPos = this.getTransform().getTransformedPos().multiply(-1);

    //Mat4
    var cameraTranslation = new Mat4().translation(
      cameraPos.getX(),
      cameraPos.getY(),
      cameraPos.getZ()
    );

    const t = this.projection.multiply(
      cameraRotation.multiply(cameraTranslation)
    );

    console.log("rotation", this.getTransform().rot.toString);
    // console.log("cameraRotation", cameraRotation.toString);
    // console.log("cameraPos", cameraPos.toString);
    // console.log("cameraTranslation", cameraTranslation.toString);
    // console.log("projection", this.projection.toString);

    return t;
  }
  update(tick) {
    this.reset();

    this.move(new Vec4(0, 0, -20));
    // this.currentFX(tick);
  }

  //Input, float
  updateInput(input, delta) {
    // Speed and rotation amounts are hardcoded here.
    // In a more general system, you might want to have them as variables.
    //floats
    var sensitivityX = 2.66 * delta;
    var sensitivityY = 2.0 * delta;
    var movAmt = 5.0 * delta;

    switch (input.getKey()) {
      case Input.Key.W:
        this.move(this.getTransform().getRot().getForward(), movAmt);
        break;
      case Input.Key.A:
        this.move(this.getTransform().getRot().getLeft(), movAmt);
        break;
      case Input.Key.S:
        this.move(this.getTransform().getRot().getForward(), -movAmt);
        break;
      case Input.Key.D:
        this.move(this.getTransform().getRot().getRight(), movAmt);
        break;
      case Input.Key.RIGHT:
        this.rotate(Camera.Y_AXIS, sensitivityX);
        break;
      case Input.Key.LEFT:
        this.rotate(Camera.Y_AXIS, -sensitivityX);
        break;
      case Input.Key.DOWN:
        this.rotate(this.getTransform().getRot().getRight(), sensitivityY);
        break;
      case Input.Key.UP:
        this.rotate(this.getTransform().getRot().getRight(), -sensitivityY);
        break;
    }
  }

  moveTo(to, tick) {
    this.transform = this.getTransform().setPos(
      this.getTransform().getPos().lerp(to, tick)
    );
    if (this.getTransform().getPos() >= to.z) {
      this.getTransform().getPos().z = to.z;
      return;
    }
  }

  move(pos) {
    this.transform = this.transform.setPos(pos);
  }

  //Vec4, float
  rotate(axis, angle) {
    this.transform = this.getTransform().rotate(
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

Camera.Y_AXIS = new Vec4(0, 1, 0);
