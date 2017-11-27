var LOCAL = true;
var loader;

var display;
var target;

var autoPlay = true;

var animLoop = null;
var isRunning = false;
var isWireframe = false;
var isFullscreen = false;
var isShowCurve = false;
var isDebugSound = false;

var resources;

var timeline;
var ui;
var maquina;
var tunnel;
var camera;
var propsTyper;

//DEBUG STUFF
var DEBUG = false;
var audioDebug;
var isEditing = true;
// var debugCanvas;
// var debugCtx;
var debugAnalyserData;

function init() {

    ui = new UI(document.getElementById("menu"), onUI);
    window.onresize = ui.setupLayout;
    toConsole("initialize...", UI.Messages.WARNING);
    
    loader = document.getElementById("loader");
    
    display = new Display({
        view: document.getElementById("canvas-container"),
        w: 480,
        h: 320,
        className: "fair"    
    });
    target = display.frameBuffer;

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
            setTimeout(startWild, 500);
            break;
        }
        updateLoader(state, p);
    });
}

function updateLoader(state, percent) {

    loader.getElementsByClassName("background")[0].style.width = percent + "%";
    loader.getElementsByTagName("h1")[0].innerHTML = state;
}

function startWild() {

    toConsole("*ready*", UI.Messages.SUCCESS);

    loader.style.display = "none";

    timeline = new Timeline({
        keyframes: resources.getKeyframes(),
        callback: onKeyframe
    });
    timeline.gotoKeyframe(0);

    maquina = new Maquina(resources, target, onMaquina);

    audioDebug = new AudioDebug(maquina, onAudioDebug);
    
    camera = new PropsCamera(target, resources.getAudios());
    
    propsTyper = new PropsTyper(resources, display.getCanvas());

    ui.showHideMenu();
    document.getElementById("volume-input").value = 0;
    ui.onVolumeChange(document.getElementById("volume-input").value);

    if(autoPlay) {
        document.getElementById("play-stop-button").click();
    }
}
function endWild() {
    
    setTimeout(function() {
        propsTyper.end();
        if(isRunning) {
            document.getElementById("play-stop-button").click();
        }

        onKeyframe(0);
        
        toConsole("Wild Ended!", UI.Messages.SUCCESS);
    }, 500);
}

function loop() {

    if(!isRunning) return;

    target.clear(0x00);
    target.clearDepthBuffer();

    timeline.update();

    camera.update(timeline.tick);

    var vp = camera.getViewProjection();
    maquina.update(timeline.tick, vp);

    if(isDebugSound && debugAnalyserData) {
        audioDebug.debugSound(debugAnalyserData.src, debugAnalyserData.freq);
    }

    display.swapBuffers();
    propsTyper.update();

    if(DEBUG) {
        setTimeout(function() {
            loop();
        },500);
    } else {
        animLoop = window.requestAnimationFrame(loop);
    }
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

        case UI.Actions.STOP_PLAY:
            isRunning = !isRunning;
            if(!isRunning) {
                timeline.pause();
                maquina.pause();
                window.cancelAnimationFrame(animLoop);
                animLoop = null;

            } else {
                maquina.play(timeline.tick);
                timeline.play();
                animLoop = window.requestAnimationFrame(loop);
            }
            return isRunning;
        case UI.Actions.GOTO_FRAME:
            timeline.gotoKeyframe(data);
            maquina.setAudioTime(timeline.tick);
            camera.setCurrentFX(data);
            maquina.setCurrentFX(data);
            break;
        case UI.Actions.TOGGLE_WIREFRAME:
            isWireframe = !isWireframe;
            display.setOptions({
                option: Display.Options.SHOW_HIDE_WIREFRAME
            });
            return isWireframe;
        case UI.Actions.TOGGLE_FULLSCREEN:

            isFullscreen = !isFullscreen;
            if(isFullscreen) {
                var el = document.documentElement;
                var rfs = el.requestFullscreen
                    || el.webkitRequestFullScreen
                    || el.mozRequestFullScreen
                    || el.msRequestFullscreen;
                rfs.call(el);
            } else {
                document.webkitExitFullscreen() 
            }
            return isFullscreen;
        case UI.Actions.VOLUME_CHANGED:
            maquina.setVolume(data);
            break;
        case UI.Actions.TOGGLE_CURVE:
            isShowCurve = !isShowCurve;
            maquina.showCurve = isShowCurve;
            return isShowCurve;
        case UI.Actions.TOGGLE_ANALYSER:
            isDebugSound = !isDebugSound;

            audioDebug.clear();
            return isDebugSound;
        case UI.Actions.RELOAD:
            location.reload(true);
            break;
        case UI.Actions.UPDATE_ANALYSER:

            debugAnalyserData = data;
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

function onAudioDebug(data) {
    ui.updateAnalyserValue(data);
}

function toConsole(message, type) {

    ui.toConsole({
        message: message,
        type: type
    });

    console.log(message);
}

window.onload = init;