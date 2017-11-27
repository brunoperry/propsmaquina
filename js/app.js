var LOCAL = true;
var loader;

var display;
var target;

var animLoop = null;
var isRunning = false;

var resources;

var timeline;
var ui;
var maquina;
var tunnel;
var camera;
var propsTyper;
var app = this;

var globalVolume = 100;

function init() {

    document.getElementsByTagName("body")[0].style.opacity = 1;

    ui = new UI_prod(onUI);
    window.onresize = ui.setupLayout;
    console.log("initializing...");
    
    loader = document.getElementById("loader");

    var d = ui.getQuality();
    display = new Display({
        view: document.getElementById("canvas-container"),
        w: d.w,
        h: d.h,
        className: d.className    
    });
    target = display.frameBuffer;

}
function startWild() {

    ui.setLayout(UI_prod.Layouts.START);

    resources = new Resources(resourcesData, function(state) {
        var p = 0;
        switch(state) {
            case Resources.state.FONT:
            p = 100 / 5;
            state += "...";
            break;
            case Resources.state.LOADING_TEXTURES:
            p = 100 / 4;
            state += "...";
            break;
            case Resources.state.LOADING_AUDIO:
            p = 100 / 3;
            state += "...";
            break;
            case Resources.state.LOADING_MESHES:
            p = 100 / 2;
            state += "...";
            break;
            case Resources.state.LOADING_COMPLETE:
            p = 100 / 1;
            state += ".";
            setTimeout(runWild, 500);
            break;
        }
        ui.updateLoader(state, p);
    });
    console.log(resources.getTag());
}
function runWild() {

    console.log("*ready*");

    timeline = new Timeline({
        keyframes: resources.getKeyframes(),
        callback: onKeyframe
    });
    timeline.gotoKeyframe(0);


    camera = new PropsCamera(target, resources.getAudios());
    maquina = new Maquina(resources, target, onMaquina);
    propsTyper = new PropsTyper(resources, display.getCanvas());


    if(globalVolume !== 100) maquina.setVolume(globalVolume);

    isRunning = true;
    isStarted = true;

    ui.setLayout(UI_prod.Layouts.RUNNING);
    
    animLoop = window.requestAnimationFrame(loop); 

    maquina.play(timeline.tick);
    timeline.play();
}
function endWild() {
    
    setTimeout(function() {
        propsTyper.end();

        maquina.pause();
        timeline.pause();
        ui.setLayout(UI_prod.Layouts.END);
        window.cancelAnimationFrame(animLoop);
        animLoop = null;
        isRunning = false;
        
        console.log("Wild Ended!");
    }, 1000);
}
function loop() {

    if(!isRunning) return;

    target.clear(0x00);
    target.clearDepthBuffer();

    timeline.update();

    camera.update(timeline.tick);
    // camera.updateInput(display.getInput(), timeline.delta);

    var vp = camera.getViewProjection();
    maquina.update(timeline.tick, vp);

    display.swapBuffers();
    propsTyper.update();

    animLoop = window.requestAnimationFrame(loop); 
}
function onKeyframe(id) {

    if(id === Resources.FX.FX12) {
        endWild();
    }

    camera.setCurrentFX(id);
    maquina.setCurrentFX(id);
    propsTyper.setCurrentFX(id);
}
function onUI(action, data) {

    switch(action) {

        case States.START:
            startWild();
            break;
        case States.PLAY:

            maquina.play(timeline.tick);
            timeline.play();
            animLoop = window.requestAnimationFrame(loop);
            isRunning = true;
            ui.setLayout(UI_prod.Layouts.RUNNING);
            break;
        case States.PAUSE:

            timeline.pause();
            maquina.pause();
            window.cancelAnimationFrame(animLoop);
            animLoop = null;
            isRunning = false;
            ui.setLayout(UI_prod.Layouts.MAIN_MENU);
            break;
        case States.CHANGE_VOLUME:

            globalVolume = data;
            if(maquina) {
                maquina.setVolume(globalVolume);
            }
            break;
        case States.CHANGE_QUALITY:
            display.reset(data);
            target = display.frameBuffer;
            if(camera) {
                camera.resetTarget(target);
            }
            if(maquina) {
                maquina.resetTarget(target);
            }
            if(propsTyper) {
                propsTyper.resetCanvas(display.getCanvas());
            }
            
            break;
    }
}
function onMaquina(e, header=null) {

    if(e < 0) {
        propsTyper.updateHeader(header.blink);
    } else {
        propsTyper.updateProp(e);
    }
}

States = {
    START: 0,
    PLAY: 1,
    PAUSE: 2,
    CHANGE_VOLUME: 3,
    CHANGE_QUALITY: 4
    
}

window.onload = init;