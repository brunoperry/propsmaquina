class Vec4 {

    constructor(x, y, z, w) {

        this.x = x;
        this.y = y;
        this.z = z;
        if(w === undefined) this.w = 0;
        else this.w = w;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    equals(vec) {

        return  this.x === vec.x &&
                this.y === vec.y &&
                this.z === vec.z
    }

    static greaterOrEqualThan(vecA, vecB) {

        return vecA.x >= vecB.x && vecA.y >= vecB.y && vecA.z >= vecB.z;
    }

    max() {
        return Math.max(Math.max(this.x, this.y), Math.max(this.z, this.w));
    }

    dot(r) {
        return this.x * r.x + this.y * r.y + this.z * r.z + this.w * r.w;
    }

    cross(vec) {

        var x_ = this.y * vec.z - this.z * vec.y;
        var y_ = this.z * vec.x - this.x * vec.z;
        var z_ = this.x * vec.y - this.y * vec.x;

        return new Vec4(x_, y_, z_, 0);
    }

    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    static crossVecs(a, b){

        var x_ = a.y * b.z - a.z * b.y;
        var y_ = a.z * b.x - a.x * b.z;
        var z_ = a.x * b.y - a.y * b.x;
        
        return new Vec4(x_, y_, z_, 0);
    }

    // Vec4, float / returns: Vec4
    lerp(dest, lerpFactor) {

        if(lerpFactor > 1) {

            return dest;
        } else {
            return dest.subtractVec(this).multiply(lerpFactor).addVec(this);
        }
    }
    
    

    normalized() {

        var length = this.length();
		return new Vec4(this.x / length, this.y / length, this.z / length, this.w / length);
    }

	rotate(axis, angle) {
		var sinAngle = Math.sin(-angle);
		var cosAngle = Math.cos(-angle);

		return this.cross(axis.mul(sinAngle)).add(              //Rotation on local X
				(this.mul(cosAngle)).add(                       //Rotation on local Z
                axis.mul(this.dot(axis.mul(1 - cosAngle)))));   //Rotation on local Y
	}

    //Quaternion
    rotateQuat(rotation) {

        var conjugate = rotation.conjugate();

		var w = rotation.multiplyVec(this).multiplyQuat(conjugate);

		return new Vec4(w.getX(), w.getY(), w.getZ(), 1.0);
    }

    add(r) {
        return new Vec4(this.x + r, this.y + r, this.z + r, this.w + r);
    }

    addVec(r) {
        return new Vec4(this.x + r.x, this.y + r.y, this.z + r.z, this.w + r.w);
    }

    subtract(r) {
        return new Vec4(this.x - r, this.y - r, this.z - r, this.w - r);
    }

    subtractVec(r) {
        return new Vec4(this.x - r.x, this.y - r.y, this.z - r.z, this.w - r.w);
    }

    subtractQuat(r) {
        return new Vec4(this.x - r.x, this.y - r.y, this.z - r.z, this.w - r.w);
    }

    multiply(r) {
        return new Vec4(this.x * r, this.y * r, this.z * r, this.w * r);
    }

    multiplyVec(r) {
        return new Vec4(this.x * r.x, this.y * r.y, this.z * r.z, this.w * r.w);
    }

    divide(r) {
        return new Vec4(this.x / r, this.y / r, this.z / r, this.w / r);
    }

    getX() {return this.x}
    getY() {return this.y}
    getZ() {return this.z}
    getW() {return this.w}

    //static
    static up() {
        return new Vec4(0,1,0);
    }
    static right() {
        return new Vec4(1,0,0);
    }
    static forward() {
        return new Vec4(0,0,1);
    }
    static all() {
        return new Vec4(1,1,1);
    }

    static addVecs(vecA, vecB) {

        return new Vec4(vecA.x + vecB.x,
                        vecA.y + vecB.y,
                        vecA.z + vecB.z,
                        vecA.w + vecB.w);
    }

    static subtractVecs(vecA, vecB) {

        return new Vec4(vecA.x - vecB.x,
                        vecA.y - vecB.y,
                        vecA.z - vecB.z,
                        vecA.w - vecB.w)
    }

    static multiplyVecByNum(vec, n) {

        return new Vec4(vec.x * n,
                        vec.y * n,
                        vec.z * n,
                        vec.w * n);
    }
                    
    //params: Vec4,Vec4,  float / returns: Vec4
    static lerpVecs(startP, endP, percent) {
        if(percent >= 1) {
            return endP;
        }
        return Vec4.subtractVecs(endP, startP).multiply(percent).addVec(startP);
    }


    static nLerp(start, end, percent) {
        if(percent >= 1) {
            return endP;
        }
        return Vec4.lerpVecs(start,end,percent).normalized();
    }

    //params: Vec4, Vec4 / returns: Vec4
    static distance(vecA, vecB) {
        return Math.sqrt(Math.pow(vecA.x - vecB.x, 2) + Math.pow(vecA.y - vecB.y, 2) + Math.pow(vecA.z - vecB.z, 2));
    }
}