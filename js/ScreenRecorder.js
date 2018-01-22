class ScreenRecorder {

    constructor(data) {

        this.callback = data.callback;
        this.setToRecord = false;
        this.isRecording = false;
        this.display = data.display;

        this.view = data.view;
        this.startView = this.view.querySelectorAll(".sr-container")[0];
        this.stopView = this.view.querySelectorAll(".sr-container")[1];

        this.label = this.stopView.querySelector("label");

        this.videoData = null;
        this.currentFXID = "all";
    }

    startRecording() {
        this.view.style.display = "flex";
        this.stopView.style.display = "none";
        this.startView.style.display = "flex";
    }

    stopRecording() {

        this.isRecording = false;
        this.display.setScreenRecord(this.isRecording);
        this.videoData = this.display.getScreenRecordingData();
        
        this.view.style.display = "flex";
        this.stopView.style.display = "flex";
        this.startView.style.display = "none";
        this.label.innerHTML = "Save " + this.videoData.length + " files?<br> It may take a while...";
        this.setToRecord = false;
        toConsole("Stop recording FX" + this.currentFXID);
    }

    saveFiles() {

        let counter = 0;
        const totalFrames = this.videoData.length;
        const instance = this;
        let fileName = "";

        var zipImages = new JSZip();
        for(let i = 0; i < totalFrames; i++) {
            fileName = "shot" + i + ".jpg";
            zipImages.file(fileName, this.videoData[i]);
        }
        this.label.innerHTML = "Saving zip file...";
        zipImages.generateAsync({type:"blob"})
        .then(function(content) {
            saveAs(content, "shotImages.zip");
            instance.onUI(ScreenRecorder.Actions.CANCEL);
        });
    }

    setCurrentFX(fxID) {

        if(this.currentFXID === "all") return;

        if(this.setToRecord && fxID === this.currentFXID) {

            this.isRecording = true;
            this.display.setScreenRecord(this.isRecording);
            toConsole("Start recording FX" + this.currentFXID);

        } else if(this.isRecording && fxID !== this.currentFXID) {
            this.stopRecording();
            this.callback({
                type: ScreenRecorder.Actions.STOP_WILD
            });
        }
    }

    onUI(type, elem=null) {

        switch(type) {

            case ScreenRecorder.Actions.SAVE:
                this.saveFiles();
            break;
            case ScreenRecorder.Actions.CANCEL:
                this.view.style.display = "none";
                this.currentFXID = 0;
                this.setToRecord = false;
                this.isRecording = false;
                this.videoData = [];
                this.callback({
                    type: ScreenRecorder.Actions.UPDATE_UI,
                    value: this.setToRecord
                });
            break;
            case ScreenRecorder.Actions.RECORD:
                this.view.style.display = "none";
                this.setToRecord = true;
                this.callback({
                    type: ScreenRecorder.Actions.UPDATE_UI,
                    value: this.setToRecord
                });
                toConsole("waiting for FX" + this.currentFXID + "...", UI.Messages.WARNING);
            break;
            case ScreenRecorder.Actions.SELECT:

                if(elem.value === "all") {
                
                    this.isRecording = true;
                    this.currentFXID = elem.value;
                    this.display.setScreenRecord(this.isRecording);
                    toConsole("Start recording all FXs");
                    return;
                } else {
                    this.currentFXID = parseInt(elem.value);
                }
                
            break;
        }
    }
}

ScreenRecorder.Actions = {
    SAVE: "save",
    CANCEL: "cancel",
    SELECT: "select",
    RECORD: "record",
    UPDATE_UI: "updateui",
    STOP_WILD: "stopwild"
}