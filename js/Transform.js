class Transform {

	//Vec4, Qauternion, Vec4
    constructor(pos, rot, scale) {

		this.pos = pos;
        this.rot = rot;
		this.scale = scale;

		if(this.pos === undefined) this.pos = new Vec4(0, 0, 0, 0);
		if(this.rot === undefined) this.rot = new Quaternion();
		if(this.scale === undefined) this.scale = new Vec4(1, 1, 1, 1);
	}
	
	clone() {

		return new Transform(this.pos, this.rot, this.scale);
	}

	//params: Vec4 returns: Transform
	setPos(pos) {
		return new Transform(pos, this.rot, this.scale);
	}

    //params: Quaternion / returns: Transform
	rotate(rotation) {

		return new Transform(this.pos, rotation.multiplyQuat(this.rot).normalized(), this.scale);
	}

	//params: Vec4 / returns: Transform
	setScale(scl) {

		return new Transform(this.pos, this.rot, scl);
	}

    //params: Vec4, Vec4 / returns: Transform
	lookAt(point, up) {
		return this.rotate(this.getLookAtRotation(point, up));
	}

    //Vec4, Vec4 / returns: Quaternion
	getLookAtRotation(point, up) {

		var mat = new Mat4();
		var v = point.subtractVec(this.pos).normalized();

		return new Quaternion({
            type: Quaternion.Type.INIT_MAT,
			mat: mat.rotationFU(v, up)
		});
	}


    //Mat4
	getTransformation() {

		var translationMatrix = new Mat4().translation(this.pos.getX(), this.pos.getY(), this.pos.getZ());
		var rotationMatrix = this.rot.toRotationMatrix();
		
		var scaleMatrix = new Mat4().scale(this.scale.getX(), this.scale.getY(), this.scale.getZ());

		return translationMatrix.multiply(rotationMatrix.multiply(scaleMatrix));
	}

	getTransformedPos() {
		return this.pos;
	}

	getTransformedRot() {
		return this.rot;
	}

	getPos() {
		return this.pos;
	}

	getRot() {
		return this.rot;
	}

	getScale() {
		return this.scale;
	}
}