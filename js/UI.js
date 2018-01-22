//UI
class UI {

    constructor(view, callback) {

        this.fxContainer = document.getElementById("fx-container");
        this.consoleContainer = document.getElementById("console");
        this.textArea = this.consoleContainer.getElementsByClassName("textarea")[0]
        this.callback = callback;
        this.isMenu = false;
        this.isFX = false;
        this.isConsole = false;
        this.isAnalyser = false;

        this.isEditing = true;

        this.recordButton = document.getElementById("record-button");

        this.setupLayout(null);
    }

    setupLayout(e) {
        document.getElementById("equalizer").width = 3000;
        document.getElementById("equalizer").height = 100;
    }
    playStop(target) {

        var t = this.callback(UI.Actions.STOP_PLAY)
        var polygon = target.getElementsByTagName("polygon")[0];
        if(t) {
            polygon.style.fill = "white";
        } else {
            polygon.style.fill = "var(--grey-3)";
        }

        if(this.isMenu && !this.isEditing) {
            document.getElementById("menu-button").click();
        }
    }
    showHideMenu(target) {

        this.isMenu = !this.isMenu;

        if(this.isMenu) {
            document.getElementById("menu").style.display = "flex";
        } else {
            document.getElementById("menu").style.display = "none";
        }
    }
    gotoFX(fxID) {

        this.callback(UI.Actions.GOTO_FRAME, fxID);
    }
    toggleFullscreen(target) {

        if(this.callback(UI.Actions.TOGGLE_FULLSCREEN)) {
            target.style.color = "white";
        } else {
            target.style.color = "black";
        }
    }
    toggleCurve(target) {

        if(this.callback(UI.Actions.TOGGLE_CURVE)) {
            target.style.color = "white";
        } else {
            target.style.color = "black";
        }
    }
    showHideFX(target) {

        this.isFX = !this.isFX;
        var label = target.getElementsByClassName("button-label")[0];
        
        if(this.isFX) {
            this.fxContainer.style.display = "block";
            label.style.color = "white";
            target.style.background = "var(--red-1)";
        } else {
            this.fxContainer.style.display = "none";
            label.style.color = "black";
            target.style.background = "none";
        }
    }
    toggleAnalyser(target) {

        this.isAnalyser = this.callback(UI.Actions.TOGGLE_ANALYSER)

        if(this.isAnalyser) {
            target.style.color = "white";
            document.getElementById("freq").style.display = "block";
        } else {
            target.style.color = "black";
            document.getElementById("freq").style.display = "none";
        }
    }

    doScreenRecord(target) {

        this.callback(UI.Actions.SCREEN_RECORD);
    }

    toggleScreenRecordButton(val) {

        console.log(val);
        if(val) {
            this.recordButton.style.color = "red";
        } else {
            this.recordButton.style.color = "black";
        }
    }
    onVolumeChange(value) {

        this.callback(UI.Actions.VOLUME_CHANGED, value);
        document.getElementById("volume-background").style.width = value + "%";
        var elem = document.getElementById("volume-button").getElementsByTagName("span")[0];
        elem.innerHTML = "VOLUME: " +  (Math.round(value)) + "%";
    }
    updateAnalyser(e) {

        var inputs = e.getElementsByTagName("input");
        var src = parseInt(inputs[0].value);
        var freq = parseInt(inputs[1].value)

        if(!Number.isInteger(src) || !Number.isInteger(freq)) {
            toConsole( "wrong values!", UI.Messages.ERROR);
            return;
        }
        this.callback(UI.Actions.UPDATE_ANALYSER, {src:src, freq:freq});

        toConsole("analyser updated:");
        toConsole("src: " + src);
        toConsole("freq: " + freq);
    }
    updateAnalyserValue(val) {

        document.getElementById("analyser-value").innerHTML = val;
    }
    showHideConsole(target) {

        this.isConsole = !this.isConsole;

        if(this.isConsole) {
            target.style.color = "white";
            target.style.position = "absolute";
            target.style.width = "100%";
            this.consoleContainer.style.maxHeight = "256px";
            this.consoleContainer.style.width = "50%";
            this.textArea.style.display = "block";
        } else {
            target.style.color = "black";
            target.style.position = "relative";
            target.style.width = "auto";
            this.consoleContainer.style.maxHeight = "32px";
            this.consoleContainer.style.width = "auto";
            this.textArea.style.display = "none";
        }
    }
    toConsole(data) {

        var elem = document.createElement("span");

        switch(data.type) {

            case UI.Messages.VERBOSE:
                elem.style.color = "white";
            break;

            case UI.Messages.WARNING:
                elem.style.color = "var(--yellow-1)";

            break;

            case UI.Messages.SUCCESS:
                elem.style.color = "var(--green-1)";
            break;

            case UI.Messages.ERROR:
                elem.style.color = "var(--red-1)";
                elem.style.fontWeight = "bold";
            break;
        }
        elem.innerHTML = data.message;

        this.textArea.appendChild(elem);
        
        this.textArea.scrollTop = this.textArea.scrollHeight;
    }
    reload() {

        this.callback(UI.Actions.RELOAD);
    }
}

UI.Actions = {

    STOP_PLAY: 0,
    GOTO_FRAME: 1,
    SCREEN_RECORD: 2,
    TOGGLE_FULLSCREEN: 3,
    VOLUME_CHANGED: 4,
    TOGGLE_CURVE: 5,
    TOGGLE_ANALYSER: 6,
    RELOAD: 7,
    UPDATE_ANALYSER: 8
}

UI.Messages = {
    VERBOSE: 0,
    WARNING: 1,
    SUCCESS: 2,
    ERROR: 3
}