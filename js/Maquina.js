class Maquina {

    constructor (resources, renderer, callback) {

        this.showCurve = false;
        this.showTunnels = false;
        this.showPulsar = false;
        this.startTime = Timeline.time();
        this.callback = callback;

        this.tracks = resources.getAudios();
        this.renderer = renderer;
        this.transform = new Transform(new Vec4(0,0,0), new Quaternion(), new Vec4(1,1,1));

        this.startTime = null;

        //AUDIO
        this.audioContext = resources.getAudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        for(var i = 0; i < this.tracks.length; i++) {

            this.tracks[i].setGainNode(this.gainNode);
        }

        this.timerID = null;

        //CONTROL POINTS
        this.CP0 = null;
        this.CP1 = null;
        this.CP2 = null;
        this.CP3 = null;
        this.currentPoint = null;

        this.positions = [];
        this.currentPosition = 0;
        this.rotations = [];
        this.scales = [];
        this.directions = [];
        this.radiosities = [];
        this.isBlinking = false;

        //TRANFORMS
        this.journeyLength = null;
        this.startPos = null;
        this.endPos = null;
        this.startScl = null;
        this.endScl = null;
        this.rot = null;
        this.startRot = null;
        this.rotEnd = null;
        this.previousFreq = null;

        //CUBES

        this.cubes = [
            new Object3D({
                mesh: resources.getMesh(1).clone(),
                texture: resources.getTexture(1).clone(),
                rad: 1
            }),
            new Object3D({
                mesh: resources.getMesh(1).clone(),
                texture: resources.getTexture(1).clone(),
                rad: 1
            }),
            new Object3D({
                mesh: resources.getMesh(8).clone(),
                texture: resources.getTexture(1).clone(),
                rad: 1
            }),
            new Object3D({
                mesh: resources.getMesh(1).clone(),
                texture: resources.getTexture(1).clone(),
                rad: 1
            }),
            new Object3D({
                mesh: resources.getMesh(1).clone(),
                texture: resources.getTexture(1).clone(),
                rad: 1
            })
        ];
        this.cubes[0].setMainTexture(2);
        this.cubes[1].setMainTexture(1);
        this.cubes[3].setMainTexture(1);
        this.cubes[4].setMainTexture(2);

        this.flameMesh = new Object3D({
            mesh: resources.getMesh(9).clone(),
            texture: resources.getTexture(3).clone()
        }, false);

        this.particles = new ParticlesSystem({
            numParticles: 300,
            resources: this.resources
        });

        this.gears = [
            new Object3D({
                mesh: resources.getMesh(0).clone(),
                texture: resources.getTexture(0).clone()
            }),
            new Object3D({
                mesh: resources.getMesh(0).clone(),
                texture: resources.getTexture(0).clone()
            }),
            new Object3D({
                mesh: resources.getMesh(0).clone(),
                texture: resources.getTexture(0).clone()
            }),
            new Object3D({
                mesh: resources.getMesh(0).clone(),
                texture: resources.getTexture(0).clone()
            }),
            new Object3D({
                mesh: resources.getMesh(0).clone(),
                texture: resources.getTexture(0).clone()
            })
        ];

        this.pump = new Pump(resources);

        this.pulsar = new Object3D({
            mesh: resources.getMesh(4).clone(),
            texture: resources.getTexture(4).clone()
        }, false);
        
        this.currentMeshes = this.cubes;

        this.curve = new BezierCurve();

        this.reset();

        this.currentFX = this.FX01;
    }

    update(tick, viewPerspective) {

        this.reset();

        this.currentFX(tick);
        
        for(var i = 0; i < this.currentMeshes.length; i++) {
            this.currentMeshes[i].update(this.renderer, viewPerspective, tick);
        }

        if(this.particles.isEmission) {
            this.particles.reset();
            this.particles.update(this.renderer, viewPerspective, tick);
        }
        
        if(this.showTunnels) {

            this.pump.update(this.renderer, viewPerspective);
        }

        if(this.showPulsar) {
            this.pulsar.update(this.renderer, viewPerspective);
        }
        
        this.flameMesh.update(this.renderer, viewPerspective, tick);

        if(this.showCurve) {
            this.curve.draw(this.renderer, viewPerspective, true);
        }
    }

    resetTarget(target) {
        this.renderer = target;
    }

    reset() {
        
        for(var i = 0; i < this.currentMeshes.length; i++) {
            this.currentMeshes[i].reset();
        }
        this.flameMesh.reset();

        if(this.showTunnels) {
            this.pump.reset();
        }
        
        if(this.showPulsar) {
            this.pulsar.reset();
        }

        if(this.particles.isEmission) {
            this.particles.reset();
        }
        this.CP0 = new Vertex(new Vec4(-1,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
        this.CP1 = new Vertex(new Vec4(-0.5,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
        this.CP2 = new Vertex(new Vec4(0.5,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
        this.CP3 = new Vertex(new Vec4(1,0,0), new Vec4(1,1,1), new Vec4(1,1,1));
        this.transform = new Transform(new Vec4(0,0,0), new Quaternion(), new Vec4(1,1,1));

        this.curve.reset(this.CP0.clone(), this.CP1.clone(), this.CP2.clone(), this.CP3.clone());


        this.positions = [];
        this.rotations = [];
        this.scales = [];
        this.directions = [];
        this.radiosities = [];
    }

    transformPoints() {

        var m = this.transform.getTransformation();
        this.CP0 = this.CP0.transform(m,m);
        this.CP1 = this.CP1.transform(m,m);
        this.CP2 = this.CP2.transform(m,m);
        this.CP3 = this.CP3.transform(m,m);
    }

    getTransformedData() {

        return [
            {
                pos: this.positions[0],
                rot: this.rotations[0],
                scl: this.scales[0],
                lA: {
                    dir: this.directions[0],
                    up: Vec4.up()
                },
                rad: this.radiosities[0]
            },
            {
                pos: this.positions[1],
                rot: this.rotations[1],
                scl: this.scales[1],
                lA: {
                    dir: this.directions[1],
                    up: Vec4.up()
                },
                rad: this.radiosities[1]
            },
            {
                pos: this.positions[2],
                rot: this.rotations[2],
                scl: this.scales[2],
                lA: {
                    dir: this.directions[2],
                    up: Vec4.up()
                },
                rad: this.radiosities[2]
            },
            {
                pos: this.positions[3],
                rot: this.rotations[3],
                scl: this.scales[3],
                lA: {
                    dir: this.directions[3],
                    up: Vec4.up()
                },
                rad: this.radiosities[3]
            },
            {
                pos: this.positions[4],
                rot: this.rotations[4],
                scl: this.scales[4],
                lA: {
                    dir: this.directions[4],
                    up: Vec4.up()
                },
                rad: this.radiosities[4]
            }
        ];
    }

    giveGas(data) {

        if(!data) {
            this.flameMesh.setScale(new Vec4(0,0,0));
            return;
        }

        this.flameMesh.setPos(data.pos);
        this.flameMesh.setRotate(data.rot);
        this.flameMesh.setScale(data.scale);
        this.flameMesh.lookAt(data.dir, Vec4.up());
    }

    FX01(tick) {

        var x = this.tracks[0].getFrequency(370) ;
        if(x > 0) {
            x *= 3;
        }

        this.curve.C0.pos.x -= (x * 1.5);
        this.curve.C3.pos.x += (x * 1.5);

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];
        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 4)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 2)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 2)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 4)
            })
        ];

        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];
        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];

        var radiosity = 1;
        if(x - 0.2 > 0.1) {
            radiosity = 100;
        }
        this.radiosities = [
            radiosity,
            radiosity,
            1,
            radiosity,
            radiosity
        ];

        var scale;
        if(x < 0.5) {
            scale = new Vec4(x, x, x);
        } else {
            scale = new Vec4(0,0,0);
        }
        this.giveGas({
            pos: this.positions[2],
            rot: new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: Utils.toRadians(tick * 200)
            }),
            dir: this.directions[3],
            scale: scale
        });
        
        this.updateMechanics(this.getTransformedData());
        this.checkBlink(this.tracks[0].getFrequency(470), 0, 0.001);
    }

    FX02(tick) {

        this.transform = this.transform.rotate(new Quaternion({
            type: Quaternion.Type.INIT_VEC_ANGLE,
            vec: Vec4.all(),
            angle: tick
        }));

        var x = this.tracks[0].getFrequency(370) * 2 ;
        if(x > 0.1) {
            x *= 3;
        }

        
        this.curve.C0.pos.x -= x;
        this.curve.C1.pos.x -= (x / 2);
        this.curve.C2.pos.x += (x / 2);
        this.curve.C3.pos.x += x;

        var m = this.transform.getTransformation();
        this.curve.C0 = this.curve.C0.transform(m,m);
        this.curve.C1 = this.curve.C1.transform(m,m);
        this.curve.C2 = this.curve.C2.transform(m,m);
        this.curve.C3 = this.curve.C3.transform(m,m);

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];
        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 6)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 4)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 2)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 4)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 6)
            })
        ];

        var scale = Math.abs(Math.sin(tick) * 1.1) + x;
        if(scale < 1) scale = 1;

        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(scale,scale,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];
        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];
        var radiosity = 1;
        if(this.tracks[3].getFrequency(10) >= 0.85) radiosity = 100;
        this.radiosities = [
            radiosity,
            radiosity,
            100,
            radiosity,
            radiosity
        ];
        

        var scale;
        x = this.tracks[0].getFrequency(370) ;
        if(x > 0) {
            x *= 3;
        }
        if(x > 0.2) {
            scale = new Vec4(x * 1.2, x * 1.2, x * 1.2);
        } else {
            scale = new Vec4(0,0,0);
        }
        this.giveGas({
            pos: this.positions[2],
            rot: new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: Utils.toRadians(tick * 200)
            }),
            dir: this.directions[3],
            scale: scale
        });

        this.updateMechanics(this.getTransformedData());
        this.checkBlink(this.tracks[0].getFrequency(470), 0, 0.0001);
    }
    
    FX03(tick) {

        this.transform = this.transform.rotate(new Quaternion({
            type: Quaternion.Type.INIT_VEC_ANGLE,
            vec: Vec4.all(),
            angle: tick 
        }));

        var x = Math.abs(Math.sin(tick) * 1.1);
        this.curve.C0.pos.x = -2;
        this.curve.C1.pos.x -= x;
        this.curve.C1.pos.y -= x;
        this.curve.C1.pos.z -= x;
        this.curve.C2.pos.x -= (x / 2);
        this.curve.C2.pos.y += (x / 2);
        this.curve.C2.pos.z += x;
        this.curve.C3.pos.x = 2;

        var m = this.transform.getTransformation();
        this.curve.C0 = this.curve.C0.transform(m,m);
        this.curve.C1 = this.curve.C1.transform(m,m);
        this.curve.C2 = this.curve.C2.transform(m,m);
        this.curve.C3 = this.curve.C3.transform(m,m);

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rot = -(tick * 8);
        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 15)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 10)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                // angle: -(tick * 8)
                angle: this.rot
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 10)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 15)
            })
        ];

        var scale = this.tracks[3].getFrequency(10);
        if(scale < 0.85) scale = 1;
        else scale *= 1.2;

        var t = Math.sin(tick * 0.25);
        var t2 = Math.sin(tick * 0.5);
        var t3 = Math.sin(tick * 0.75);
        var t4 = Math.sin(tick * 1);

        this.scales = [
            new Vec4(t * 0.25,t * 0.25,t * 0.25),
            new Vec4(t2 * 0.5,t2 * 0.5,t2 * 0.5),
            new Vec4(scale,scale,1),
            new Vec4(t3 * 0.5,t3 * 0.5,t3 * 0.5),
            new Vec4(t4 * 0.25,t4 * 0.25,t4 * 0.25)
        ];
        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];

        var radiosity = 1;
        if(this.tracks[3].getFrequency(10) >= 0.85) radiosity = 100;
        this.radiosities = [
            radiosity,
            radiosity,
            radiosity,
            radiosity,
            radiosity
        ];
        this.giveGas();

        this.updateMechanics(this.getTransformedData());
        this.checkBlink(this.tracks[15].getFrequency(358), 0, 0.001);
    }
    
    FX04(tick) {
        
        this.transform = this.transform.rotate(new Quaternion({
            type: Quaternion.Type.INIT_VEC_ANGLE,
            vec: Vec4.up(),
            angle: tick
        }));

        var pY = Math.sin(tick);
        this.curve.C0.pos.x = -0.8;
        this.curve.C0.pos.y = pY * 1.2;
        this.curve.C1.pos.x = -0.9;
        this.curve.C1.pos.y = -pY;
        this.curve.C2.pos.x = 0.9;
        this.curve.C2.pos.y = pY;
        this.curve.C3.pos.x = 0.8;
        this.curve.C3.pos.y = -(pY * 1.2);

        var m = this.transform.getTransformation();
        this.curve.C0 = this.curve.C0.transform(m,m);
        this.curve.C1 = this.curve.C1.transform(m,m);
        this.curve.C2 = this.curve.C2.transform(m,m);
        this.curve.C3 = this.curve.C3.transform(m,m);


        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 20)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 15)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 8)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 15)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 20)
            })
        ];
        
        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];
        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];

        var radiosity = 1;
        if(this.tracks[3].getFrequency(10) >= 0.85) radiosity = 100;
        this.radiosities = [
            radiosity,
            radiosity,
            100,
            radiosity,
            radiosity
        ];
        this.giveGas();

        this.updateMechanics(this.getTransformedData());
        this.checkBlink(this.tracks[15].getFrequency(358), 0, 0.001);
    }

    FX05(tick) {

        var r = null;
        var rotation = this.tracks[5].getFrequency(170);

        if(Maquina.RotationDirection === 1) {
            r = tick + rotation;
        } else {
            r = -(tick + rotation);
        }
        this.transform = this.transform.rotate(new Quaternion({
            type: Quaternion.Type.INIT_VEC_ANGLE,
            vec: Vec4.up(),
            angle: r
        }));

        this.curve.C0.pos.x = -0.8;
        this.curve.C1.pos.x = -0.9;
        this.curve.C2.pos.x = 0.9;
        this.curve.C3.pos.x = 0.8;


        var m = this.transform.getTransformation();
        this.curve.C0 = this.curve.C0.transform(m,m);
        this.curve.C1 = this.curve.C1.transform(m,m);
        this.curve.C2 = this.curve.C2.transform(m,m);
        this.curve.C3 = this.curve.C3.transform(m,m);

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick + (rotation * 1.5))
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick + (rotation * 1.2))
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: rotation
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick + (rotation * 1.2))
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick + (rotation * 1.5))
            })
        ];
        
        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];
        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];
        
        var radiosity = 1;
        this.radiosities = [
            radiosity,
            radiosity,
            radiosity,
            radiosity,
            radiosity
        ];
        this.giveGas();

        this.updateMechanics(this.getTransformedData());
    }

    FX06(tick) {


        var position = Math.sin(tick/10);
        var rotation = this.tracks[5].getFrequency(170);

        this.curve.C0.pos.x = -0.7;
        this.curve.C0.pos.y = -(position + rotation);
        this.curve.C1.pos.x = -0.8;
        this.curve.C2.pos.x = 0.8;
        this.curve.C3.pos.x = 0.7;
        this.curve.C3.pos.y = position + rotation;
        
        var r = null;
        if(Maquina.RotationDirection === 1) {
            r = tick + rotation;
        } else {
            r = -(tick + rotation);
        }
        this.transform = this.transform.rotate(new Quaternion({
            type: Quaternion.Type.INIT_VEC_ANGLE,
            vec: Vec4.up(),
            angle: r
        }));

        var m = this.transform.getTransformation();
        this.curve.C0 = this.curve.C0.transform(m,m);
        this.curve.C1 = this.curve.C1.transform(m,m);
        this.curve.C2 = this.curve.C2.transform(m,m);
        this.curve.C3 = this.curve.C3.transform(m,m);

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick + (rotation * 1.5))
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick + (rotation * 1.2))
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: rotation * 3
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick + (rotation * 1.2))
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick + (rotation * 1.5))
            })
        ];
        
        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];
        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];
        
        var radiosity = 1;
        this.radiosities = [
            radiosity,
            radiosity,
            radiosity,
            radiosity,
            radiosity
        ];
        this.giveGas();

        this.updateMechanics(this.getTransformedData());
    }

    FX07(tick) {

        var distCovered = Timeline.time() - this.startTime;
        var f = distCovered / this.journeyLength * 180;

        var a = Vec4.lerpVecs(this.startRot, this.endRot, f);
        var r;
        if(f < 1) {
            r = new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.all(),
                angle: Utils.toRadians(a.x)
            });
        } else {
            r = new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.all(),
                angle: Utils.toRadians(this.endRot.x)
            });
        }
        
        this.transform = this.transform.rotate(r);

        var valA = Vec4.lerpVecs(new Vec4(0.7,0.7,0.7), new Vec4(1,1,1), f).x;
        var valB = Vec4.lerpVecs(new Vec4(0.8,0.8,0.8), new Vec4(0.5,0.5,0.5), f).x;
        if(f > 1) {
            valA = 1;
            valB = 0.5;
        }


        var x = Math.sin(tick) / 2.5;
        this.curve.C0.pos.x = -valA;
        this.curve.C1.pos.x = -valB;
        this.curve.C1.pos.y = x;
        this.curve.C2.pos.x = valB;
        this.curve.C2.pos.y = -x;
        this.curve.C3.pos.x = valA;

        var m = this.transform.getTransformation();
        this.curve.C0 = this.curve.C0.transform(m,m);
        this.curve.C1 = this.curve.C1.transform(m,m);
        this.curve.C2 = this.curve.C2.transform(m,m);
        this.curve.C3 = this.curve.C3.transform(m,m);

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 8)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 5)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 20
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 5)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: (tick * 8)
            })
        ];


        var b = Vec4.lerpVecs(new Vec4(500,0,0), new Vec4(200,0,0), f);
        this.rotations[2] = new Quaternion({
            type: Quaternion.Type.INIT_VEC_ANGLE,
            vec: Vec4.forward(),
            angle: Utils.toRadians(tick * (b.x))
        });


        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];
        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];
        
        var radiosity = 1;
        this.radiosities = [
            radiosity,
            radiosity,
            radiosity,
            radiosity,
            radiosity
        ];

        this.pump.rotate(tick * 3);
        this.pump.doPumpBass(this.tracks[7].getFrequency(100));
        
        this.giveGas();

        this.updateMechanics(this.getTransformedData());
    }

    FX08(tick) {

        var x = Math.sin(tick) / 2.5;

        this.curve.C0.pos.x = -1;
        this.curve.C1.pos.x = -0.5;
        this.curve.C1.pos.y = x;
        this.curve.C2.pos.x = 0.5;
        this.curve.C2.pos.y = -x;
        this.curve.C3.pos.x = 1;

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 10
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 5
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: Utils.toRadians(tick * 200)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 5)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 10)
            })

        ];

        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];

        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];

        this.radiosities = [
            1,
            1,
            1,
            1,
            1
        ]

        var scale = this.tracks[6].getFrequency(3);
        if(this.isBlinking !== this.blink()) {
            this.isBlinking = !this.isBlinking;
            this.currentPosition++;
            this.callback(scale);
            if(this.currentPosition >= this.positions.length) {
                this.currentPosition = 0;
            }
        }
        if(this.isBlinking) {
            this.scales[this.currentPosition] = new Vec4(1.1,1.3,1.1);
            this.radiosities[this.currentPosition] = 1000;
        }

        this.pump.bass(this.tracks[10]);
        this.pump.doPumpBass(this.tracks[7].getFrequency(100));
        this.pump.rotate(tick * 3);

        x = this.tracks[10].getFrequency(3);
        if(x > 0.01) {
            this.callback(-1, {
                blink: true
            });
            this.giveGas({
                pos: this.positions[this.currentPosition],
                rot: new Quaternion({
                    type: Quaternion.Type.INIT_VEC_ANGLE,
                    vec: Vec4.forward(),
                    angle: Utils.toRadians(tick * 200)
                }),
                dir: this.directions[this.currentPosition],
                scale: new Vec4(x - 0.7,x - 0.7,x - 0.7)
            });
        } else {
             this.callback(-1, {
                blink: false
            });
            this.giveGas();
        }

        this.updateMechanics(this.getTransformedData());
    }

    FX09(tick) {

        var x = Math.sin(tick) / 2.5;

        this.curve.C0.pos.x = -1;
        this.curve.C1.pos.x = -0.5;
        this.curve.C1.pos.y = x;
        this.curve.C2.pos.x = 0.5;
        this.curve.C2.pos.y = -x;
        this.curve.C3.pos.x = 1;

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 10
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 5
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 3
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 5)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 10)
            })

        ];

        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];

        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];

        this.radiosities = [
            1,
            1,
            1,
            1,
            1
        ]

        var scale = this.tracks[6].getFrequency(3);
        if(this.isBlinking !== this.blink()) {
            this.isBlinking = !this.isBlinking;
            this.currentPosition++;
            this.callback(scale);
            if(this.currentPosition >= this.positions.length) {
                this.currentPosition = 0;
            }
        }
        if(this.isBlinking) {
            this.scales[this.currentPosition] = new Vec4(1.1,1.3,1.1);
            this.radiosities[this.currentPosition] = 1000;
        }
        
        this.pump.bass(this.tracks[10]);
        this.pump.doPumpBass(this.tracks[10].getFrequency(3));
        this.pump.rotate(tick * 3);

        x = this.tracks[10].getFrequency(3);
        if(x > 0.01) {
            this.callback(-1, {
                blink: true
            });
            this.giveGas({
                pos: this.positions[this.currentPosition],
                rot: new Quaternion({
                    type: Quaternion.Type.INIT_VEC_ANGLE,
                    vec: Vec4.forward(),
                    angle: Utils.toRadians(tick * 200)
                }),
                dir: this.directions[this.currentPosition],
                scale: new Vec4(x - 0.7,x - 0.7,x - 0.7)
            });
        } else {
             this.callback(-1, {
                blink: false
            });
            this.giveGas();
        }

        this.updateMechanics(this.getTransformedData());
    }

    FX10(tick) {

        var x = Math.sin(tick) / 2.5;

        this.curve.C0.pos.x = -1;
        this.curve.C1.pos.x = -0.5;
        this.curve.C1.pos.y = -x;
        this.curve.C2.pos.x = 0.5;
        this.curve.C2.pos.y = x;
        this.curve.C3.pos.x = 1;

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 10
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 5
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 5)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 10)
            })

        ];

        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];

        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];

        this.radiosities = [
            1,
            1,
            1,
            1,
            1
        ]

        var scale = this.tracks[6].getFrequency(3);
        if(this.isBlinking !== this.blink()) {
            this.isBlinking = !this.isBlinking;
            this.currentPosition++;
            this.callback(scale);
            if(this.currentPosition >= this.positions.length) {
                this.currentPosition = 0;
            }
        }
        if(this.isBlinking) {
            this.scales[this.currentPosition] = new Vec4(1.1,1.5,1.1);
            this.radiosities[this.currentPosition] = 1000;
        }
        
        this.pump.bass(this.tracks[10]);
        this.pump.doPumpBass(this.tracks[10].getFrequency(3));
        this.pump.rotate(tick * 3);

        this.pulsar.setPos(new Vec4(0,0,-80));
        this.pulsar.setScale(new Vec4(40,40,40));
        // this.pulsar.setRotate(new Quaternion({
        //     type: Quaternion.Type.INIT_VEC_ANGLE,
        //     vec: new Vec4(0,0,1),
        //     angle: Utils.toRadians(Math.sin(tick) + 30)
        // }));

        x = this.tracks[10].getFrequency(3);
        if(x > 0.01) {
            this.callback(-1, {
                blink: true
            });
            this.giveGas({
                pos: this.positions[this.currentPosition],
                rot: new Quaternion({
                    type: Quaternion.Type.INIT_VEC_ANGLE,
                    vec: Vec4.forward(),
                    angle: Utils.toRadians(tick * 200)
                }),
                dir: this.directions[this.currentPosition],
                scale: new Vec4(x - 0.5,x - 0.5,x - 0.5)
            });
        } else {
             this.callback(-1, {
                blink: false
            });
            this.giveGas();
        }

        this.updateMechanics(this.getTransformedData());
    }

    FX11(tick) {

        var scale = Math.sin(tick) / 2.5;

        this.curve.C0.pos.x = -1;
        this.curve.C1.pos.x = -0.5;
        this.curve.C1.pos.y = -scale;
        this.curve.C2.pos.x = 0.5;
        this.curve.C2.pos.y = scale;
        this.curve.C3.pos.x = 1;

        this.positions = [
            this.curve.getPoint(0),
            this.curve.getPoint(0.25),
            this.curve.getPoint(0.5),
            this.curve.getPoint(0.75),
            this.curve.getPoint(1)
        ];

        this.scales = [
            new Vec4(0.25,0.25,0.25),
            new Vec4(0.5,0.5,0.5),
            new Vec4(1,1,1),
            new Vec4(0.5,0.5,0.5),
            new Vec4(0.25,0.25,0.25)        
        ];

        this.directions = [
            this.curve.getDirection(0),
            this.curve.getDirection(0.25),
            this.curve.getDirection(0.5),
            this.curve.getDirection(0.75),
            this.curve.getDirection(1)
        ];

        this.rotations = [

            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 10
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick * 5
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: tick
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 5)
            }),
            new Quaternion({
                type: Quaternion.Type.INIT_VEC_ANGLE,
                vec: Vec4.forward(),
                angle: -(tick * 10)
            })
            
        ];

        this.radiosities = [
            1000,
            1000,
            1000,
            1000,
            1000
        ];

        this.giveGas();
        
        this.updateMechanics(this.getTransformedData());
    }

    checkBlink(val, min, max) {

        if(val > max && !this.isBlinking) {
            this.isBlinking = true;
            this.callback(val);
        } else if(val < max && this.isBlinking) {
            this.isBlinking = false;
        }

        // if(val > min && !this.isBlinking) {
        //     this.isBlinking = true;
        //     this.callback(val);
        // } else if(val < max && this.isBlinking) {
        //     this.isBlinking = false;
        // }
    }

    blink() {

        var freqVal = this.tracks[8].getFrequency(698);
        var r = false;
        if(this.previousFreq) {

            if(freqVal - this.previousFreq < 0)r = true;
        }
        this.previousFreq = freqVal;

        return r;
    }
    
    updateMechanics(data) {

        var mech;
        for(var i = 0; i < this.currentMeshes.length; i++) {

            mech = this.currentMeshes[i];
            mech.setPos(data[i].pos);
            mech.setRotate(data[i].rot);
            mech.setScale(data[i].scl);

            if(data[i].lA !== undefined) {
                mech.lookAt(data[i].lA.dir, data[i].lA.up);
            }

            mech.setRadiance(data[i].rad);
        }
    }

    setCurrentFX(fxID) {

        this.startTime = Timeline.time();
        this.showTunnels = false;
        this.showPulsar = false;
        this.pump.isShown = false;
        this.particles.stopEmission();
        this.pulsar.texture.stop();
        this.cubes[2].setMainTexture(0);
        this.flameMesh.setMainTexture(1);


        if(this.timerID && fxID !== Resources.FX.FX06) {
            window.clearInterval(this.timerID);
            this.timerID = null;
        }

        console.log("FX0" + (fxID + 1));

        switch(fxID) {
            case Resources.FX.FX01:
                this.cubes[2].setMainTexture(3);
                this.isBlinking = false;
                this.currentMeshes = this.cubes;
                this.currentFX = this.FX01;
                break;
            case Resources.FX.FX02:

                this.startScl = new Vec4(3,3,3);
                this.endScl = new Vec4(0.75,0.75,0.75);
                this.journeyLength = Vec4.distance(this.startScl, this.endScl);

                this.currentMeshes = this.cubes;
                this.currentFX = this.FX02;
                break;
            case Resources.FX.FX03:

                this.currentMeshes = this.cubes;
                this.currentFX = this.FX03;
                break;
            case Resources.FX.FX04:
                this.startScl = this.endScl;
                // this.startScl = new Vec4(3,3,3);
                this.endScl = new Vec4(0.75,0.75,0.75);

                this.startRot = new Vec4(8, 8, 8);
                this.endRot = new Vec4(1, 1, 1);
                this.journeyLength = Vec4.distance(this.startRot, this.endRot);

                this.currentMeshes = this.cubes;
                this.currentFX = this.FX04;
                break;
            case Resources.FX.FX05:

                this.timerID = window.setInterval(function() {

                    if(Maquina.RotationDirection === 1) {
                        Maquina.RotationDirection = 0;
                    } else {
                        Maquina.RotationDirection = 1;
                    }

                }, 3275);
                this.currentMeshes = this.cubes;
                this.currentFX = this.FX05;
                break;
            case Resources.FX.FX06:

                this.particles.setSimulation([
                    this.cubes[0].getPos(),
                    this.cubes[1].getPos(),
                    this.cubes[2].getPos(),
                    this.cubes[3].getPos(),
                    this.cubes[4].getPos()
                ]);
                this.particles.startEmission();
                this.currentMeshes = this.gears;
                this.currentFX = this.FX06;
                break;
            case Resources.FX.FX07:

                this.showTunnels = true;
                this.startPos = new Vec4(0,0,0);
                this.endPos = new Vec4(0,0,24);
                this.startRot = new Vec4(300,300,300)
                this.endRot = new Vec4(0, 0, 0);
                this.journeyLength = Vec4.distance(this.startRot, this.endRot);

                this.currentMeshes = this.gears;
                this.currentFX = this.FX07;
                break;
            case Resources.FX.FX08:
            
                this.isBlinking = false;
                this.showTunnels = true;
                this.pump.isShown = true;
                this.currentMeshes = this.gears;
                this.currentFX = this.FX08;
                break;
            case Resources.FX.FX09:
            
                this.isBlinking = false;
                this.showTunnels = true;
                this.pump.isShown = true;
                this.currentMeshes = this.gears;
                this.currentFX = this.FX09;
                break;
            case Resources.FX.FX10:

                this.pulsar.texture.play();
                // this.flameMesh.setMainTexture(0);
                this.showTunnels = true;
                this.showPulsar = true;
                this.pump.isShown = true;
                this.currentMeshes = this.gears;
                this.currentFX = this.FX10;
                break;
            case Resources.FX.FX11:
                this.currentMeshes = this.gears;
                this.currentFX = this.FX11;
                break;
        }
    }

    setAudioTime(time) {
        for(var i = 0; i < this.tracks.length; i++) {
            this.tracks[i].setTimeAt(time);
        }
    }

    setVolume(vol) {

        this.gainNode.gain.value = vol / 100;
    }

    play() {
        this.startTime = Timeline.time();
        for(var i = 0; i < this.tracks.length; i++) {
            this.tracks[i].play();
        }
    }

    pause() {
        for(var i = 0; i < this.tracks.length; i++) {
            this.tracks[i].pause();
        }
    }

    getFrequency(trackID, freq) {
        return this.tracks[trackID].getFrequency(freq)
    }
}

//1 CW, 0 CCW
Maquina.RotationDirection = 1;