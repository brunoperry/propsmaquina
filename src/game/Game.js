import Resources from "../Resources.js";

class Game {

    constructor() {

        this.meshes = null;
        this.renderer = null;
        this.camera = null;
    }

    async setData(gameDataURL) {

        return await fetch(Resources.PATH + gameDataURL).
            then(result => {
                return result.json();
            }).
            then(jsonData => {
                this.meshes = Resources.getMeshes(jsonData.meshes);

                return this;
            }).
            catch(error => {
                throw new Error(error);
            });
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    update(tick) {
        this.reset();
    }

    reset() {

    }

    render(renderer) {

        // this.currentFX(tick);
        // for(var i = 0; i < this.meshes.length; i++) {
        //     this.meshes[i].update(this.renderer, viewPerspective, tick);
        // }
    }
}

export default Game;