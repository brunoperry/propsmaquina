class ParticlesSystem {

    constructor(data) {

        this.numParticles = data.numParticles;

        this.particlesObj3D = [];

        for(var i = 0; i < this.numParticles; i++) {

            this.particlesObj3D.push({
                
                obj3d: new Object3D({
                    mesh: resources.getMesh(2).clone(),
                    texture: resources.getTexture(2),
                    rad: 1000
                }),
                animData: {
                    startPos: null,
                    endPos: null,
                    rotation: null,
                    journeyLength: null
                }
            });
        }

        this.startTime = null;
    }

    update(renderer, vp, tick) {

        if(!this.isEmission) return;

        var distCovered = Timeline.time() - this.startTime;
        var p;
        var f;
        var SPEED = .5;
        var pos;
        for(var i = 0; i < this.numParticles; i++) {

            p = this.particlesObj3D[i];
            f = (distCovered / p.animData.journeyLength) * SPEED;

            pos = Vec4.lerpVecs(p.animData.startPos, p.animData.endPos, f);
            p.obj3d.setPos(pos.multiply(p.animData.speed));
            p.obj3d.setRotate(new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.all(),
                angle: p.animData.rot * tick
            }));
            p.obj3d.setScale(p.animData.scale);
            p.obj3d.update(renderer, vp, tick);
        }
    }

    reset() {
        
        for(var i = 0; i < this.numParticles; i++) {
            this.particlesObj3D[i].obj3d.reset();
        }
    }

    setSimulation(data) {

        var p;
        var posIndex;
        var x;
        var y;
        var z;
        var min = -14;
        var max = 45;
        for(var i = 0; i < this.numParticles; i++) {

            x = Math.random() * (max - min) + min;
            y = Math.random() * (max - min) + min;
            z = Math.random() * (max - min) + min;

            var scale = Math.abs(z/max);

            p = this.particlesObj3D[i];
            posIndex = Math.floor(Math.random() * ((data.length-1) - 0 + 1)) + 0;
            p.animData.startPos = data[posIndex];
            p.animData.endPos = new Vec4(x,y,z);
            p.animData.scale = new Vec4(scale,scale,scale);
            p.animData.rot = y;
            p.animData.speed = Math.random() * (max - 0) + 2;
            p.animData.journeyLength = Vec4.distance(p.animData.startPos, p.animData.endPos);
        }
    }

    startEmission() {

        this.startTime = Timeline.time();
        this.isEmission = true;
    }

    stopEmission() {
        this.isEmission = false;
    }
}