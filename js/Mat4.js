class Mat4 {

    constructor() {

        this.m = [[],[], [], []];
		this.identity();
    }

    identity() {

        this.m[0][0] = 1;   this.m[0][1] = 0;   this.m[0][2] = 0;   this.m[0][3] = 0;
        this.m[1][0] = 0;   this.m[1][1] = 1;   this.m[1][2] = 0;   this.m[1][3] = 0;
        this.m[2][0] = 0;   this.m[2][1] = 0;   this.m[2][2] = 1;   this.m[2][3] = 0;
        this.m[3][0] = 0;   this.m[3][1] = 0;   this.m[3][2] = 0;   this.m[3][3] = 1;

        return this;
    }
    
    screenSpaceTransform(halfW, halfH) {

        this.m[0][0] = halfW;   this.m[0][1] = 0;       this.m[0][2] = 0;   this.m[0][3] = halfW - 0.5;
        this.m[1][0] = 0;       this.m[1][1] = -halfH;  this.m[1][2] = 0;   this.m[1][3] = halfH - 0.5;
        this.m[2][0] = 0;       this.m[2][1] = 0;       this.m[2][2] = 1;   this.m[2][3] = 0;
        this.m[3][0] = 0;       this.m[3][1] = 0;       this.m[3][2] = 0;   this.m[3][3] = 1;

        return this;
    }
    
    perspective(fov, aspectRatio, zNear, zFar) {

		var tanHalfFOV = Math.tan(fov / 2);
		var zRange = zNear - zFar;

		this.m[0][0] = 1 / (tanHalfFOV * aspectRatio);	this.m[0][1] = 0;					this.m[0][2] = 0;	                    this.m[0][3] = 0;
        this.m[1][0] = 0;						        this.m[1][1] = 1 / tanHalfFOV;	    this.m[1][2] = 0;	                    this.m[1][3] = 0;
		this.m[2][0] = 0;						        this.m[2][1] = 0;					this.m[2][2] = (-zNear -zFar) / zRange;	this.m[2][3] = 2 * zFar * zNear / zRange;
		this.m[3][0] = 0;						        this.m[3][1] = 0;					this.m[3][2] = 1;	                    this.m[3][3] = 0;

		return this;
	}

    multiply(r) {

        var res = new Mat4();

        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                res.set(i, j,   this.m[i][0] * r.get(0, j) +
                                this.m[i][1] * r.get(1, j) + 
                                this.m[i][2] * r.get(2, j) +
                                this.m[i][3] * r.get(3, j) )
            }
        }

        return res;
    }

    translation(x, y, z) {
		this.m[0][0] = 1;	this.m[0][1] = 0;	this.m[0][2] = 0;	this.m[0][3] = x;
		this.m[1][0] = 0;	this.m[1][1] = 1;	this.m[1][2] = 0;	this.m[1][3] = y;
		this.m[2][0] = 0;	this.m[2][1] = 0;	this.m[2][2] = 1;	this.m[2][3] = z;
		this.m[3][0] = 0;	this.m[3][1] = 0;	this.m[3][2] = 0;	this.m[3][3] = 1;

		return this;
	}

    rotation(x, y, z) {
        
        var rx = new Mat4();
		var ry = new Mat4();
		var rz = new Mat4();

		rz.m[0][0] = Math.cos(z);       rz.m[0][1] = -Math.sin(z);      rz.m[0][2] = 0;				    rz.m[0][3] = 0;
		rz.m[1][0] = Math.sin(z);       rz.m[1][1] =  Math.cos(z);      rz.m[1][2] = 0;					rz.m[1][3] = 0;
		rz.m[2][0] = 0;					rz.m[2][1] = 0;					rz.m[2][2] = 1;					rz.m[2][3] = 0;
		rz.m[3][0] = 0;					rz.m[3][1] = 0;					rz.m[3][2] = 0;					rz.m[3][3] = 1;

		rx.m[0][0] = 1;					rx.m[0][1] = 0;					rx.m[0][2] = 0;					rx.m[0][3] = 0;
		rx.m[1][0] = 0;					rx.m[1][1] = Math.cos(x);       rx.m[1][2] = -Math.sin(x);      rx.m[1][3] = 0;
		rx.m[2][0] = 0;					rx.m[2][1] = Math.sin(x);       rx.m[2][2] = Math.cos(x);       rx.m[2][3] = 0;
		rx.m[3][0] = 0;					rx.m[3][1] = 0;					rx.m[3][2] = 0;					rx.m[3][3] = 1;

		ry.m[0][0] = Math.cos(y);       ry.m[0][1] = 0;					ry.m[0][2] = -Math.sin(y);      ry.m[0][3] = 0;
		ry.m[1][0] = 0;					ry.m[1][1] = 1;					ry.m[1][2] = 0;					ry.m[1][3] = 0;
		ry.m[2][0] = Math.sin(y);       ry.m[2][1] = 0;					ry.m[2][2] = Math.cos(y);       ry.m[2][3] = 0;
		ry.m[3][0] = 0;					ry.m[3][1] = 0;					ry.m[3][2] = 0;					ry.m[3][3] = 1;

		this.m = rz.multiply(ry.multiply(rx)).getM();

		return this;
	}

    //Vec4, Vec4
    rotationFU(forward, up) {

		var f = forward.normalized();
		var r = up.normalized();
		
		var tr = Vec4.crossVecs(r, f);
		var u = Vec4.crossVecs(f, tr);

		return this.rotationFUR(f, u, tr);
	}
    //Vec4, Vec4, Vec
	rotationFUR(forward, up, right) {
		var f = forward;
		var r = right;
		var u = up;

		this.m[0][0] = r.getX();	this.m[0][1] = r.getY();	this.m[0][2] = r.getZ();	this.m[0][3] = 0;
		this.m[1][0] = u.getX();	this.m[1][1] = u.getY();	this.m[1][2] = u.getZ();	this.m[1][3] = 0;
		this.m[2][0] = f.getX();	this.m[2][1] = f.getY();	this.m[2][2] = f.getZ();	this.m[2][3] = 0;
		this.m[3][0] = 0;		    this.m[3][1] = 0;		    this.m[3][2] = 0;		    this.m[3][3] = 1;

		return this;
	}

    //float, float, float
	scale(x, y, z) {

		this.m[0][0] = x;	this.m[0][1] = 0;	this.m[0][2] = 0;	this.m[0][3] = 0;
		this.m[1][0] = 0;	this.m[1][1] = y;	this.m[1][2] = 0;	this.m[1][3] = 0;
		this.m[2][0] = 0;	this.m[2][1] = 0;	this.m[2][2] = z;	this.m[2][3] = 0;
		this.m[3][0] = 0;	this.m[3][1] = 0;	this.m[3][2] = 0;	this.m[3][3] = 1;

		return this;
	}

	//params: vec4, returns: Vec4
    transform(r) {

		return new Vec4(this.m[0][0] * r.getX() + this.m[0][1] * r.getY() + this.m[0][2] * r.getZ() + this.m[0][3] * r.getW(),
                        this.m[1][0] * r.getX() + this.m[1][1] * r.getY() + this.m[1][2] * r.getZ() + this.m[1][3] * r.getW(),
                        this.m[2][0] * r.getX() + this.m[2][1] * r.getY() + this.m[2][2] * r.getZ() + this.m[2][3] * r.getW(),
                        this.m[3][0] * r.getX() + this.m[3][1] * r.getY() + this.m[3][2] * r.getZ() + this.m[3][3] * r.getW());
	}

	static fromQuaternionTranslationScale(q, v, s){
		// Quaternion math
		var x = q.x, y = q.y, z = q.z, w = q.w,
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

		var out = [[],[],[]];

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
    get(x, y) { return this.m[x][y]; }
    getM() {
		var res = [[],[], [], []];
		for(var i = 0; i < 4; i++)
			for(var j = 0; j < 4; j++)
				res[i][j] = this.m[i][j];
		return res;
	}
    set(x, y, value) { this.m[x][y] = value; }
    setM(m) { this.m = m; }
}