class Pump {

    constructor(resources) {
        
        this.isShown = false;
        this.numTunnels = 4;

        this.depth = 12;

        this.tPositions = [];
        this.tRotations = [];
        this.tScales = [];

        this.tunnels = [];
        for(var i = 0; i < this.numTunnels; i++) {
            this.tunnels.push( new Object3D({
                mesh: resources.getMesh(3).clone(),
                texture: resources.getTexture(2).clone()
            }) );
        }

        this.pumpPos = null;
        this.pumpRot = null;
        this.pumpScale = null;
        this.pumpOffset = (this.numTunnels - 1) * this.depth;

        this.pump = new Object3D({
            mesh: resources.getMesh(6).clone(),
            texture: resources.getTexture(5).clone()
        });

        this.startTime = null;
        this.journeyLength = null;
        
        this.reset();
    }

    update(renderer, viewPerspective, tick) {

        if(!this.isShown) {
             this.show(tick);
        }

        var tunnel;
        for(var i = 0; i < this.numTunnels; i++) {

            tunnel = this.tunnels[i];
            tunnel.setPos(this.tPositions[i]);
            tunnel.setRotate(this.tRotations[i]);
            tunnel.setScale(this.tScales[i]);
            tunnel.update(renderer, viewPerspective);
        }

        this.pump.setPos(this.pumpPos);
        this.pump.setRotate(this.pumpRot);
        this.pump.setScale(this.pumpScale);

        this.pump.update(renderer, viewPerspective);
    }

    show(tick) {

        if(!this.startTime) {
            this.startTime = Timeline.time();
            this.journeyLength = 1;
        }
        var distCovered = Timeline.time() - this.startTime;
        var f = (distCovered / this.journeyLength) / 3;

        var rad = Utils.lerp(0, 0.5, f);
        for(var i = 0; i < this.numTunnels; i++) {
            this.tunnels[i].setRadiance(rad);
        }

        if(f >= 1) {
            this.isShown = true;
            this.startTime = null;
        }
    }
    
    rotate(angle, twist=0) {

        for(var i = 0; i < this.numTunnels; i++) {
            
            this.tRotations[i] = new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: Utils.toRadians(angle + (twist * i))
            });
        }
    }

    bass(track) {
        
        var fVal;
        var bassVal;
        fVal = track.getFrequency(3);
        if(fVal >= 0.85) {
            bassVal = (fVal - 0.85) * 50;
        } else {
            bassVal = 0;
        }

        var mI = this.tunnels.length;
        for(var i = 0; i < this.numTunnels; i++) {
            mI --
            this.tPositions[i].z += ((bassVal / 2) * (i)) * (i * 2);
        }
        // this.pumpPos = new Vec4(0,0, (bassVal) + this.pumpOffset);
    }

    doPumpBass(val) {

        var bassVal;
        if(val >= 0.2) {
            bassVal = (val - 0.2) * 50;
        } else {
            bassVal = 0;
        }
        this.pumpPos = new Vec4(0,0, (bassVal) + this.pumpOffset);
    }
    
    reset() {
        
        this.tPositions = [];
        this.tRotations = [];
        this.tScales = [];

        for(var i = 0; i < this.numTunnels; i++){

            this.tunnels[i].reset();
            this.tPositions.push(new Vec4(0,0,(i * this.depth)));
            this.tRotations.push( new Quaternion({
                                    type:Quaternion.Type.INIT_VEC_ANGLE,
                                    vec: Vec4.all(),
                                    angle: 0
                                    }) ); 
            this.tScales.push(new Vec4(1,1,1));
        }
        
        this.pump.reset();
        this.pumpPos = new Vec4(0,0,this.pumpOffset);
        this.pumpRot = new Quaternion({
            type: Quaternion.Type.INIT_VEC_ANGLE,
            vec: Vec4.up(),
            angle: Utils.toRadians(180)
        });
        this.pumpScale = new Vec4(1,1,1);
    }
}