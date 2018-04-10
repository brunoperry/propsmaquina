import Resources from "./Resources.js";

class Game {

    constructor() {

        this.meshes = null;
     }

     async setData(gameDataURL) {

        return await fetch(Resources.PATH + gameDataURL).
        then(result => {
            return result.json();
        }).
        then(jsonData => {
            this.meshes = Resources.getMeshes(jsonData.meshes);

            console.log(this.meshes)
            return this;
        }).
        catch(error => {
            throw new Error(error);
        });
     }

    update(tick) {
        this.reset();
    }

    reset() {

    }

    render(renderer) {

        // this.currentFX(tick);
        
        // for(var i = 0; i < this.currentMeshes.length; i++) {
        //     this.currentMeshes[i].update(this.renderer, viewPerspective, tick);
        // }
    }
}

export default Game;