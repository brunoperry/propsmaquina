class Quaternion {

    constructor(data) {

		if(!data) {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

			return;
		}

        switch(data.type) {

            case Quaternion.Type.INIT_VALS:
                this.constructorWithVals(
                    data.x,
                    data.y,
                    data.z,
                    data.w
                )
                break;
            case Quaternion.Type.INIT_VEC_ANGLE:

                this.constructorWithVecAngle(
                    data.vec,
                    data.angle
                )

		
                break;
            case Quaternion.Type.INIT_MAT:

                this.constructorWithMat( data.mat )
                break;
			default:
				this.x = 0;
				this.y = 0;
				this.z = 0;
				this.w = 1;
        }
    }

    constructorWithVals(x, y, z, w) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    constructorWithVecAngle(axis, angle) {

        var sinHalfAngle = parseFloat(Math.sin(angle / 2));
		var cosHalfAngle = parseFloat(Math.cos(angle / 2));

		this.x = axis.getX() * sinHalfAngle;
		this.y = axis.getY() * sinHalfAngle;
		this.z = axis.getZ() * sinHalfAngle;
		this.w = cosHalfAngle;
    }

    constructorWithMat(rot) {

		var trace = rot.get(0, 0) + rot.get(1, 1) + rot.get(2, 2);

		if(trace > 0) {
			var s = 0.5 / parseFloat(Math.sqrt(trace + 1.0));
			this.w = 0.25 / s;
			this.x = (rot.get(1, 2) - rot.get(2, 1)) * s;
			this.y = (rot.get(2, 0) - rot.get(0, 2)) * s;
			this.z = (rot.get(0, 1) - rot.get(1, 0)) * s;
		}
		else {

			if(rot.get(0, 0) > rot.get(1, 1) && rot.get(0, 0) > rot.get(2, 2)) {

				var s = 2.0 * parseFloat(Math.sqrt(1.0 + rot.get(0, 0) - rot.get(1, 1) - rot.get(2, 2)));
				this.w = (rot.get(1, 2) - rot.get(2, 1)) / s;
				this.x = 0.25 * s;
				this.y = (rot.get(1, 0) + rot.get(0, 1)) / s;
				this.z = (rot.get(2, 0) + rot.get(0, 2)) / s;

			} else if(rot.get(1, 1) > rot.get(2, 2)) {

				var s = 2.0 * parseFloat(Math.sqrt(1.0 + rot.get(1, 1) - rot.get(0, 0) - rot.get(2, 2)));
				this.w = (rot.get(2, 0) - rot.get(0, 2)) / s;
				this.x = (rot.get(1, 0) + rot.get(0, 1)) / s;
				this.y = 0.25 * s;
				this.z = (rot.get(2, 1) + rot.get(1, 2)) / s;

			} else {

				var s = 2.0 * parseFloat(Math.sqrt(1.0 + rot.get(2, 2) - rot.get(0, 0) - rot.get(1, 1)));
				this.w = (rot.get(0, 1) - rot.get(1, 0) ) / s;
				this.x = (rot.get(2, 0) + rot.get(0, 2) ) / s;
				this.y = (rot.get(1, 2) + rot.get(2, 1) ) / s;
				this.z = 0.25 * s;
			}
		}

		var length = parseFloat(Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w));
		this.x /= length;
		this.y /= length;
		this.z /= length;
		this.w /= length;
	}

    length() {

		return parseFloat(Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w));
    }

    normalized() {

        var length = this.length();

        this.x /= length;
        this.y /= length;
        this.z /= length;
        this.w /= length;

        return this;
    }

    conjugate() {

        return new Quaternion({
			type:Quaternion.Type.INIT_VALS,
			x: -this.x,
			y: -this.y,
			z: -this.z,
			w: this.w
		});
    }

    //float 
	multiplyF(r) {
		return new Quaternion({
			type: Quaternion.Type.INIT_VALS,
			x: this.x * r,
			y: this.y * r,
			z: this.z * r,
			w: this.w * r
		});
	}

    
    multiplyQuat(r) {


		var w_ = this.w * r.getW() - this.x * r.getX() - this.y * r.getY() - this.z * r.getZ();
		var x_ = this.x * r.getW() + this.w * r.getX() + this.y * r.getZ() - this.z * r.getY();
		var y_ = this.y * r.getW() + this.w * r.getY() + this.z * r.getX() - this.x * r.getZ();
		var z_ = this.z * r.getW() + this.w * r.getZ() + this.x * r.getY() - this.y * r.getX();

        return new Quaternion({
			type: Quaternion.Type.INIT_VALS,
			x: x_,
			y: y_,
			z: z_,
			w: w_
		});
    }

    multiplyVec(vec) {
        
        var w_ = -this.x * vec.getX() - this.y * vec.getY() - this.z * vec.getZ();
        var x_ =  this.w * vec.getX() + this.y * vec.getZ() - this.z * vec.getY();
        var y_ =  this.w * vec.getY() + this.z * vec.getX() - this.x * vec.getZ();
        var z_ =  this.w * vec.getZ() + this.x * vec.getY() - this.y * vec.getX();

        return new Quaternion({
			type: Quaternion.Type.INIT_VALS,
			x: x_,
			y: y_,
			z: z_,
			w: w_
		});
    }

	subQuat(r) {
		return new Quaternion({
			type: Quaternion.Type.INIT_VALS,
			x: this.x - r.getX(),
			y: this.y - r.getY(),
			z: this.z - r.getZ(),
			w: this.w - r.getW()});
	}

	addQuat(r) {
		return new Quaternion({
			type: Quaternion.Type.INIT_VALS,
			x: this.x + r.getX(),
			y: this.y + r.getY(),
			z: this.z + r.getZ(),
			w: this.w + r.getW()});
	}

	toRotationMatrix() {

		var forward =  new Vec4(2.0 * (this.x * this.z - this.w * this.y), 2.0 * (this.y * this.z + this.w * this.x), 1.0 - 2.0 * (this.x * this.x + this.y * this.y));
		
		var up = new Vec4(2.0 * (this.x * this.y + this.w * this.z), 1.0 - 2.0 * (this.x * this.x + this.z * this.z), 2.0 * (this.y * this.z - this.w * this.x));
		var right = new Vec4(1.0 - 2.0 * (this.y * this.y + this.z * this.z), 2.0 * (this.x * this.y - this.w * this.z), 2.0 * (this.x * this.z + this.w * this.y));


		return new Mat4().rotationFUR(forward, up, right);
	}

	dot(r) {
		return this.x * r.getX() + this.y * r.getY() + this.z * r.getZ() + this.w * r.getW();
	}

    //Quaternion, float, bool
	NLerp(dest, lerpFactor, shortest) {

		var correctedDest = dest;

		if(shortest && this.dot(dest) < 0)
			correctedDest = new Quaternion({
				type: Quaternion.Type.INIT_VALS,
				x: -dest.getX(),
				y: -dest.getY(),
				z: -dest.getZ(), 
				w: -dest.getW()
			});

		return correctedDest.subQuat(this).multiplyF(lerpFactor).addQuat(this).normalized();
	}

    //quat, quaternooin, float
	// static lerp(from, to, lerpFactor, shortest) {

		

		// var correctedDest = to;

		// if(shortest && from.dot(to) < 0) {
		// 	correctedDest = new Quaternion({
		// 		type: Quaternion.Type.INIT_VALS,
		// 		x: -dest.getX(),
		// 		y: -dest.getY(),
		// 		z: -dest.getZ(), 
		// 		w: -dest.getW()
		// 	});
		// }

		// return correctedDest.subQuat(from).multiplyF(lerpFactor).addQuat(from);
	// }

	static lerp(a,b,t){
		var ax = a.x,
			ay = a.y,
			az = a.z,
			aw = a.w;

		var out = new Quaternion();
		out.x = ax + t * (b.x - ax);
		out.y = ay + t * (b.y - ay);
		out.z = az + t * (b.z - az);
		out.w = aw + t * (b.w - aw);
		return out;
	}

	static sLerp(a,b,t,shortest=false) {
		var EPSILON = 1e3;

		var cos = a.dot(b);
		var correctedDest = b;

		if(shortest && cos < 0) {
			cos = -cos;
			correctedDest = new Quaternion({
				type: Quaternion.Type.INIT_VALS,
				x: -b.getX(),
				y: -b.getY(),
				z: -b.getZ(),
				w: -b.getW()
			});
		}

		if(Math.abs(cos) >= 1 - EPSILON)
			return Quaternion.nLerp(a, correctedDest, t, false);

		var sin = parseFloat(Math.sqrt(1.0 - cos * cos));
		var angle = parseFloat(Math.atan2(sin, cos));
		var invSin =  1.0 / sin;

		var srcFactor = parseFloat(Math.sin((1.0 - t) * angle)) * invSin;
		var destFactor = parseFloat(Math.sin((t) * angle)) * invSin;

		return a.multiplyF(srcFactor).addQuat(correctedDest.multiplyF(destFactor));
	}

	static nLerp(a,b,t, shortest) {

		var correctedDest = b;

		if(shortest && a.dot(b) < 0)
			correctedDest = new Quaternion({
				type: Quaternion.Type.INIT_VALS,
				x: -b.getX(),
				y: -b.getY(),
				z: -b.getZ(), 
				w: -b.getW()
			});

		return correctedDest.subQuat(a).multiplyF(t).addQuat(a).normalized();
	}

    //Quaternion, float, boolean
	SLerp( dest, lerpFactor, shortest=false) {

		var EPSILON = 1e3;

		var cos = this.dot(dest);
		var correctedDest = dest;

		if(shortest && cos < 0) {
			cos = -cos;
			correctedDest = new Quaternion({
				type: Quaternion.Type.INIT_VALS,
				x: -dest.getX(),
				y: -dest.getY(),
				z: -dest.getZ(),
				w: -dest.getW()
			});
		}

		if(Math.abs(cos) >= 1 - EPSILON)
			return this.NLerp(correctedDest, lerpFactor, false);

		var sin = parseFloat(Math.sqrt(1.0 - cos * cos));
		var angle = parseFloat(Math.atan2(sin, cos));
		var invSin =  1.0 / sin;

		var srcFactor = parseFloat(Math.sin((1.0 - lerpFactor) * angle)) * invSin;
		var destFactor = parseFloat(Math.sin((lerpFactor) * angle)) * invSin;

		return this.multiplyF(srcFactor).addQuat(correctedDest.multiplyF(destFactor));
	}

    getForward() {

		return new Vec4(0,0,1,1).rotateQuat(this);
	}

	getBack() {
		return new Vec4(0,0,-1,1).rotateQuat(this);
	}

	getUp() {
		return new Vec4(0,1,0,1).rotateQuat(this);
	}

	getDown() {
		return new Vec4(0,-1,0,1).rotateQuat(this);
	}

	getRight() {
		return new Vec4(1,0,0,1).rotateQuat(this);
	}

	getLeft() {
		return new Vec4(-1,0,0,1).rotateQuat(this);
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

    //Quaternion
	equals(r){
		return this.x === r.getX() && this.y === r.getY() && this.z === r.getZ() && this.w === r.getW();
	}

	//params: Vec4, Vec4 / returns: Vec4
	static lookRotation(vDir, vUp){
		var zAxis	= vDir,	//Forward
			up		= vUp,
			xAxis	= new Vec4(),		//Right
			yAxis	= new Vec4();
		
		zAxis = zAxis.normalized();
		xAxis = zAxis.cross(up);
		
		xAxis = xAxis.normalized();
		yAxis = zAxis.cross(xAxis); //new up

		//fromAxis - Mat3 to Quaternion
		var m00 = xAxis.x, m01 = xAxis.y, m02 = xAxis.z,
			m10 = yAxis.x, m11 = yAxis.y, m12 = yAxis.z,
			m20 = zAxis.x, m21 = zAxis.y, m22 = zAxis.z,
			t = m00 + m11 + m22,
			x, y, z, w, s;



		if(t > 0.0){
			s = Math.sqrt(t + 1.0);
			w = s * 0.5 ; // |w| >= 0.5
			s = 0.5 / s;
			x = (m12 - m21) * s;
			y = (m20 - m02) * s;
			z = (m01 - m10) * s;
		} else if((m00 >= m11) && (m00 >= m22)){
			s = Math.sqrt(1.0 + m00 - m11 - m22);
			x = 0.5 * s;// |x| >= 0.5
			s = 0.5 / s;
			y = (m01 + m10) * s;
			z = (m02 + m20) * s;
			w = (m12 - m21) * s;
		} else if(m11 > m22){
			s = Math.sqrt(1.0 + m11 - m00 - m22);
			y = 0.5 * s; // |y| >= 0.5
			s = 0.5 / s;
			x = (m10 + m01) * s;
			z = (m21 + m12) * s;
			w = (m20 - m02) * s;
		} else{
			s = Math.sqrt(1.0 + m22 - m00 - m11);
			z = 0.5 * s; // |z| >= 0.5
			s = 0.5 / s;
			x = (m20 + m02) * s;
			y = (m21 + m12) * s;
			w = (m01 - m10) * s;
		}

		var out = new Vec4();

		out.x = x;
		out.y = y;
		out.z = z;
		out.w = w;

		return out;
	}
}

Quaternion.Type = {

    INIT_VALS: 0,
    INIT_VEC_ANGLE: 1,
    INIT_MAT: 2
}