class BezierCurve {

    constructor() {

        this.reset();
        this.samples = 0.2;
    }

    updateControls(data) {

        this.C0.setPosition(data.C0);
        this.C1.setPosition(data.C1);
        this.C2.setPosition(data.C2);
        this.C3.setPosition(data.C3);

        // if(data.C0 !== undefined) {
        //     this.C0.set(0, data.C0.x);
        //     this.C0.set(1, data.C0.y);
        //     this.C0.set(2, data.C0.z);
        // }
        // if(data.C1 !== undefined) {
        //     this.C1.set(0, data.C1.x);
        //     this.C1.set(2, data.C1.y);
        //     this.C1.set(1, data.C1.z);
        // }
        // if(data.C2 !== undefined) {
            
        //     this.C2.set(0, data.C2.x);
        //     this.C2.set(1, data.C2.y);
        //     this.C2.set(2, data.C2.z);
        // }
        // if(data.C3 !== undefined) {
        //     this.C3.set(0, data.C3.x);
        //     this.C3.set(1, data.C3.y);
        //     this.C3.set(2, data.C3.z);
        // }
    }

    getPoint(t) {

		var i = 1 - t;
		
		var out = new Vec4();
		out.x = i * i * i *     this.C0.get(0) +
				3 * i * i * t * this.C1.get(0) +
				3 * i * t * t * this.C2.get(0) +
                t * t * t *     this.C3.get(0);
                
		out.y = i * i * i *     this.C0.get(1) +
				3 * i * i * t * this.C1.get(1) +
				3 * i * t * t * this.C2.get(1) +
                t * t * t *     this.C3.get(1);
                
		out.z = i * i * i *     this.C0.get(2) +
				3 * i * i * t * this.C1.get(2) +
				3 * i * t * t * this.C2.get(2) +
                t * t * t *     this.C3.get(2);
                
		out.w = 1;
                
		return out;
    }

    //params: float / returns: Vec4
    getDirection (t) {
        
		var i = 1 - t;

		var out = new Vec4();
		out.x = 3 * i * i * (this.C1.get(0) - this.C0.get(0)) +
				6 * i * t * (this.C2.get(0) - this.C1.get(0)) +
				3 * t * t * (this.C3.get(0) - this.C2.get(0));
		
		out.y = 3 * i * i * (this.C1.get(1) - this.C0.get(1)) +
				6 * i * t * (this.C2.get(1) - this.C1.get(1)) +
				3 * t * t * (this.C3.get(1) - this.C2.get(1));

		out.z = 3 * i * i * (this.C1.get(2) - this.C0.get(2)) +
				6 * i * t * (this.C2.get(2) - this.C1.get(2)) +
                3 * t * t * (this.C3.get(2) - this.C2.get(2));

		out.w = 0;
                
		return out.normalized().multiply(0.1).addVec(this.getPoint(t));
    }

    reset(c0,c1,c2,c3) {
        
        this.C0 = new Vertex(new Vec4(-1,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
        this.C1 = new Vertex(new Vec4(-0.5,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
        this.C2 = new Vertex(new Vec4(0.5,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
        this.C3 = new Vertex(new Vec4(1,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
    }

    //context, Transform, Mat4, float
    draw(context, transform, tan=false) {

        var points = [];
        var point;
        var p;
        var dirs = [];
        var d;
        for(var i = 0; i <= 1; i += this.samples) {
            point = this.getPoint(i)
            p = transform.transform(point);
            points.push(new Vertex(p, null, null));

            if(tan) {
                d = transform.transform(this.getDirection(i));
                dirs.push({
                    a: new Vertex(p, null, null),
                    b: new Vertex(d, null, null)
                });
            }
        }
        context.drawCurve(points);

        if(tan) {
            context.drawTangents(dirs, Color.red);
        }
    }
}