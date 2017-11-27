//UI_prod
class UI_prod {

    constructor(callback) {

        this.callback = callback;

        var instance = this;

        this.setLayout(UI_prod.Layouts.INIT);
    }

    onStart() {
        this.callback(States.START);
    }

    onPlay() {
        this.callback(States.PLAY);
    }

    onReplay() {
        this.onRestart();
    }

    onSettings() {
        this.setLayout(UI_prod.Layouts.SETTINGS);
    }

    onFullscreen(elem) {

        var isFullscreen = !elem.className.length > 0;
        if(elem.className.length > 0) {
            elem.className = "";
        } else {
            elem.className = "active";
        }
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
    }

    onPause() {
        this.callback(States.PAUSE);    
    }

    onRestart() {
        location.reload(true);
    }
    
    onBack() {
        this.setLayout(UI_prod.Layouts.MAIN_MENU);  
    }

    onVolumeChange(value) {

        document.getElementById("volume-background").style.width = value + "%";
        var elem = document.getElementById("volume-button").getElementsByTagName("label")[0];
        elem.innerHTML = "GAIN: " +  (Math.round(value));

        this.callback(States.CHANGE_VOLUME, value);  
    }

    onQualityChange(value) {

        var radios = document.getElementById("quality-buttons").children;

        for(var i = 0; i < radios.length; i++) {

            if(radios[i].className.length > 0) radios[i].className = "radio-button";
        }
        radios[value].className = "radio-button-active";

        this.callback(States.CHANGE_QUALITY, Display.Quality[value]);
    }

    getQuality() {
        var radios = document.getElementById("quality-buttons").children;
        for(var i = 0; i < radios.length; i++) {
            if(radios[i].className === "radio-button-active") return Display.Quality[i];
        }
        return null;
    }

    setLayout(layout) {

        switch(layout) {

            case UI_prod.Layouts.INIT:
                document.getElementById("menu").style.display = "flex";
                document.getElementById("start").style.display = "block";
                document.getElementById("overlay").style.display = "flex";
                document.getElementById("play").style.display = "none";
                document.getElementById("replay").style.display = "none";
                document.getElementById("restart").style.display = "none";
            break;
            case UI_prod.Layouts.START:
                document.getElementById("start").style.display = "none";
                document.getElementById("play").style.display = "block";
                document.getElementById("restart").style.display = "block";
                document.getElementById("overlay").style.display = "none";
                document.getElementById("menu").style.display = "none";
                document.getElementById("loader").style.display = "block";
            break;
            case UI_prod.Layouts.RUNNING:
                document.getElementById("menu").style.display = "none";
                document.getElementById("loader").style.display = "none";
                document.getElementById("overlay").style.display = "none";

                //WTF??
                var instance = this;
                var ev = function() {
                    instance.onPause();
                    document.removeEventListener("click", ev);
                }
                window.setTimeout(function() {
                    document.addEventListener("click", ev);
                }, 20);
                //WTF??

                break;
            case UI_prod.Layouts.MAIN_MENU:
                document.getElementById("menu").style.display = "flex";
                document.getElementById("overlay").style.display = "flex";
                break;
            case UI_prod.Layouts.END:
                document.getElementById("menu").style.display = "flex";
                document.getElementById("start").style.display = "none";
                document.getElementById("overlay").style.display = "flex";
                document.getElementById("play").style.display = "none";
                document.getElementById("volume-button").style.display = "none";
                document.getElementById("quality-buttons").style.display = "none";
                document.getElementById("fullscreen").style.display = "none";
                document.getElementById("replay").style.display = "block";
                document.getElementById("restart").style.display = "none";
                break;
        }
    }

    updateLoader(message, percent) {

        document.getElementById("loader").getElementsByTagName("h2")[0].innerHTML = message;
        document.getElementById("background").style.width = percent + "%";
    }
}

UI_prod.Layouts = {

    INIT: 0,
    RUNNING: 1,
    MAIN_MENU: 2,
    LOADING: 3,
    END: 4
}