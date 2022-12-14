class PropsCamera extends Camera {
  constructor(target, tracks) {
    super(
      new Mat4().perspective(
        parseFloat(Utils.toRadians(70.0)),
        parseFloat(target.getWidth()) / parseFloat(target.getHeight()),
        0.1,
        1000.0
      )
    );

    this.tracks = tracks;
    this.currentFX = null;
    this.currentFXID = null;
    this.startTime = null;

    this.startPos = new Vec4(0, 0, 0);
    this.position = new Vec4(0, 0, -20);
    this.endPos = new Vec4(0, 0, 0);
    this.journeyLength = null;

    this.rot = null;

    this.trigger = false;
    this.posY = 0;
    this.posZ = 0;

    this.setCurrentFX(Resources.FX.FX01);
  }

  update(tick) {
    this.reset();

    this.move(this.position);
    // this.currentFX(tick);
  }

  reset() {
    super.reset();
    this.rot = Quaternion.lookRotation(new Vec4(0, 0, 1000), Camera.Y_AXIS);
  }

  FX01(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = (distCovered / this.journeyLength) * 30;

    // var camPos = Vec4.lerpVecs(this.startPos, this.endPos, f);
    this.position = Vec4.lerpVecs(this.startPos, this.endPos, f);

    if (f > 1) {
      var v = Math.sin(tick * 0.3) / 1.2;
      this.position.x = v;
      this.position.z = v * 2 - 3;
    }

    this.move(this.position);
    this.lookAt(this.rot, Camera.Y_AXIS);
  }
  FX02(tick) {
    var v = Math.sin(tick * 0.3) / 2;
    this.position.z = v * 2 - 3;

    this.move(this.position);
    // this.move(this.endPos);
    this.rotate(new Vec4(0, 0, 1), Utils.toRadians(12));
    this.lookAt(this.rot, Camera.Y_AXIS);
  }
  FX03(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = (distCovered / this.journeyLength) * 30;

    this.position = Vec4.lerpVecs(this.startPos, this.endPos, f);

    this.move(this.position);
    // this.move(this.endPos);
  }
  FX04(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = (distCovered / this.journeyLength) * 30;

    this.position = Vec4.lerpVecs(this.startPos, this.endPos, f);
    this.move(this.position);
  }
  FX05(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = (distCovered / this.journeyLength) * 100;

    this.move(Vec4.lerpVecs(this.startPos, this.endPos, f));
    this.rotate(new Vec4(0, 0, 1), Utils.toRadians(-12));
  }
  FX06(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = (distCovered / this.journeyLength) * 300;

    this.move(Vec4.lerpVecs(this.startPos, this.endPos, f));
  }
  FX07(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = (distCovered / this.journeyLength) * 5;

    var camPos = Vec4.lerpVecs(this.startPos, this.endPos, f);

    this.move(camPos);
  }
  FX08(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = distCovered / this.journeyLength;

    var val;
    var camPos = this.startPos.clone();
    var v = Math.sin(tick * 0.3) / 2;
    if (f > 1) {
      val = 1;
      camPos.x = v;
      camPos.z = v * 2 + camPos.z;
    } else {
      val = Vec4.lerpVecs(new Vec4(0, 0, 0), new Vec4(1, 1, 1), f).x;
      camPos.x = v * val;
      camPos.z = v * 2 * val + camPos.z;
    }

    this.move(camPos);
    this.lookAt(this.rot, Camera.Y_AXIS);
  }

  FX09(tick) {
    var camPos = this.startPos.clone();
    var v = Math.sin(tick * 0.3) / 2;
    camPos.x = v;
    camPos.z = (v + camPos.z) * 2;

    this.move(camPos);
    this.lookAt(this.rot, Camera.Y_AXIS);
  }

  FX10(tick) {
    const fA = this.tracks[14].getFrequency(20);
    const fB = this.tracks[14].getFrequency(30);

    const res = Math.abs(fA - fB);
    let anim = res >= 0.18 ? true : false;

    var distCovered = Timeline.time() - this.startTime;
    var f = distCovered / this.journeyLength;

    var camPos = Vec4.lerpVecs(this.startPos, this.endPos, f);

    var orbiter = new Vec4(0, 0, camPos.z);
    var ori = new Vec4(0, 0, 0);
    var speed = 30;

    let radius;
    if (anim) {
      radius = -(camPos.z + res * 5);
      this.posZ = radius;
    } else {
      radius = this.posZ;
    }

    if (this.trigger !== anim) {
      this.trigger = anim;

      if (this.trigger) {
        this.posY = Math.floor(Math.random() * -3) + 3;
      }
    }
    orbiter.x =
      ori.x + radius * Math.cos(Utils.toRadians((tick + 135) * speed));
    orbiter.z =
      ori.z + radius * Math.sin(Utils.toRadians((tick + 135) * speed));
    orbiter.y = this.posY;

    this.setPerspective(70 - radius);

    this.move(orbiter);
    this.lookAt(ori, Camera.Y_AXIS);
  }
  FX11(tick) {
    var distCovered = Timeline.time() - this.startTime;
    var f = (distCovered / this.journeyLength) * 100;

    this.move(Vec4.lerpVecs(this.startPos, this.endPos, f));
  }

  setCurrentFX(fxID) {
    switch (fxID) {
      case Resources.FX.FX01:
        this.startTime = Timeline.time();
        this.startPos = new Vec4(0, 0, -10);
        this.endPos = new Vec4(0, 0, -2.5);
        this.journeyLength = Vec4.distance(this.startPos, this.endPos);

        this.currentFX = this.FX01;
        break;
      case Resources.FX.FX02:
        this.endPos = new Vec4(2, -0.5, -4);
        this.currentFX = this.FX02;
        break;
      case Resources.FX.FX03:
        this.endPos = new Vec4(0, 0, -4);
        this.currentFX = this.FX03;
        break;
      case Resources.FX.FX04:
        this.startPos = this.position;
        this.endPos = new Vec4(0, 0, -4);
        this.currentFX = this.FX04;
        break;
      case Resources.FX.FX05:
        this.startTime = Timeline.time();
        this.startPos = new Vec4(0, 0, -4);
        this.endPos = new Vec4(0, 0, -2);
        this.currentFX = this.FX05;
        break;
      case Resources.FX.FX06:
        this.startTime = Timeline.time();
        this.startPos = new Vec4(0, 0, -2);
        this.endPos = new Vec4(0, 0, -4);
        this.currentFX = this.FX06;
        break;
      case Resources.FX.FX07:
        this.startTime = Timeline.time();
        this.startPos = this.transform.getPos().clone();
        this.endPos = new Vec4(0, 0, -2);
        this.currentFX = this.FX07;
        break;
      case Resources.FX.FX08:
        this.startTime = Timeline.time();
        this.startPos = this.transform.getPos().clone();
        this.endPos = new Vec4(0, 0, -2);
        this.journeyLength = 1;
        this.currentFX = this.FX08;
        break;
      case Resources.FX.FX09:
        this.startPos = this.transform.getPos().clone();
        this.currentFX = this.FX09;
        break;
      case Resources.FX.FX10:
        this.startTime = Timeline.time();
        this.startPos = this.transform.getPos().clone();
        this.endPos = new Vec4(0, 0, -4);
        this.currentFX = this.FX10;
        break;
      case Resources.FX.FX11:
        this.startTime = Timeline.time();
        this.setPerspective(70.0);
        this.startPos = new Vec4(0, 0, -1.5);
        this.endPos = new Vec4(0, 0, -100);
        this.journeyLength = Vec4.distance(this.startPos, this.endPos);
        this.currentFX = this.FX11;
        break;
    }
  }
}
