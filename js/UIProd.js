//UI
class UI {
    
        constructor(view, callback) {
    
            this.callback = callback;
    
            this.isMenu = false;
            this.isPlay = false;
            this.isFullscreen = false;
    
        }
    
        playStop() {
    
            this.callback(UI.Actions.STOP_PLAY);
    
            this.isPlay = !this.isPlay;
            if(this.isPlay) {
                document.getElementById("play-stop").style.color = "white";
            } else {
                document.getElementById("play-stop").style.color = "black";
            }
    
            this.showHideMenu();
        }
    
        doPlayStop(e) {
    
            document.getElementById("play-stop").click();
        }
        showHideMenu() {
    
            if(this.isPlay) {
                document.getElementById("menu").style.display = "none";
                var instance = this;
                window.setTimeout(function() {
                    document.addEventListener("click", instance.doPlayStop);
                }, 100);
            } else {
                document.getElementById("menu").style.display = "flex";
                document.removeEventListener("click", this.doPlayStop)
            }
        }
     
        toggleFullscreen(target) {
    
            this.callback(UI.Actions.TOGGLE_FULLSCREEN)
        }
       
        reload(target) {
    
            console.log(this.callback)
            this.callback(UI.Actions.RELOAD);
        }
    }
    
    UI.Actions = {
    
        STOP_PLAY: 0,
        GOTO_FRAME: 1,
        TOGGLE_WIREFRAME: 2,
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