import Mesh from "../components/Mesh.js";
import Texture from "../rendering/Texture.js";
import OBJLoader from "../loaders/OBJLoader.js";
import ImageLoader from "../loaders/ImageLoader.js";
import Utils from "../Utils.js";
import Bitmap from "../rendering/Bitmap.js";

export default class Resources {
  static #fileType = {
    FBX: "fbx",
    OBJ: "obj",
    JPG: "jpg",
    PNG: "png",
    MP3: "mp3",
    OGG: "ogg",
  };

  static #path = "resources";

  static #initialized = false;
  static #meshes = new Map();
  static #textures = new Map();

  static async init(resourcesURL = `${Resources.#path}/resources.json`) {
    if (this.#initialized) return;
    this.#initialized = true;
    const req = await fetch(resourcesURL);
    const data = await req.json();

    //create meshes
    for (let i = 0; i < data.meshes.length; i++) {
      const m = data.meshes[i];
      const meshData = await this.loadFile({
        url: `${Resources.#path}/meshes/${m.url}`,
        name: m.name,
      });
      this.#meshes.set(m.name, new Mesh(meshData));
    }

    //create textures
    for (let i = 0; i < data.textures.length; i++) {
      const t = data.textures[i];
      const name = t.name;

      const textureData = await this.loadFile({
        url: `${Resources.#path}/textures/${t.url}`,
        name: name,
      });
      this.#textures.set(
        name,
        new Texture({
          name: name,
          bitmap: new Bitmap({
            width: textureData.width,
            height: textureData.height,
            data: textureData.imageData,
          }),
        })
      );
    }
  }

  static async loadFile(data) {
    const tmp = data.url.split(".");
    const extension = tmp[tmp.length - 1];
    let loader;
    switch (extension) {
      case Resources.#fileType.OBJ:
        loader = OBJLoader;
        break;
      case Resources.#fileType.FBX:
        // loader = FBXLoader;
        break;
      case Resources.#fileType.JPG:
        loader = ImageLoader;
        break;
      case Resources.#fileType.PNG:
        break;
      case Resources.#fileType.MP3:
        break;
    }
    return await loader.load(data);
  }

  checkLoadingComplete() {
    if (
      this.fontLoaded &&
      this.texturesLoaded &&
      this.audiosLoaded &&
      this.meshesLoaded
    ) {
      this.callback(Resources.state.LOADING_COMPLETE);
    }
  }

  //GETTERS SETTERS
  static getTexture(name) {
    return Resources.#textures.get(name);
  }
  static getMesh(name) {
    return Resources.#meshes.get(name);
  }
}

Resources.state = {
  LOADING_TEXTURES: "loading textures",
  LOADING_AUDIO: "loading audio",
  LOADING_MESHES: "loading meshes",
  LOADING_FONT: "loading font",
  LOADING_COMPLETE: "loading complete",
};
