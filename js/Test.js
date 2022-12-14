class Test {
  constructor(resources, renderer, callback) {
    this.startTime = Timeline.time();
    this.callback = callback;
    this.renderer = renderer;
    this.transform = new Transform(
      new Vec4(0, 0, 0),
      new Quaternion(),
      new Vec4(1, 1, 1)
    );

    this.startTime = null;

    this.cube = new Object3D({
      mesh: resources.getMesh(1).clone(),
      texture: resources.getTexture(1).clone(),
      rad: 1,
    });

    this.cube.setPos(new Vec4(0, 0, 50));
    this.reset();
  }

  update(tick, viewPerspective) {
    this.reset();
    this.cube.update(this.renderer, viewPerspective, tick);
  }

  reset() {}

  play() {}

  pause() {}
}

//1 CW, 0 CCW
Test.RotationDirection = 1;
