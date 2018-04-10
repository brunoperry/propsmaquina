import OBJModel from "./loaders/ObjModel.js";
import Mesh from "./components/Mesh.js";

class Resources {

    constructor(data) { }

    static async loadData(dataURL) {
        return await fetch(Resources.PATH + dataURL).
            then(result => {
                return result.json();
            }).
            then(data => {
                Resources.Data = data;
                return Resources.loadMeshes(Resources.Data.meshes);
            }).
            then(meshesData => {
                Resources.Meshes = meshesData;
                return Resources.loadTextures(Resources.Data.textures);
            }).
            then(texturesData => {
                Resources.Textures = texturesData;
                return Resources.loadTextures(Resources.Data.audios);
            }).
            then(audiosData => {
                Resources.Audios = audiosData;
                return true;
            }).
            catch(error => {
                throw new Error(error);
            });
    }

    static getMeshes(mesheIDs) {

        const meshes = [];
        for (let i = 0; i < mesheIDs.length; i++) {
            meshes.push(Resources.Meshes[mesheIDs[i]]);
        }
        return meshes;
    }

    static async loadMeshes(meshesData) {

        const urls = [];
        for (let i = 0; i < meshesData.length; i++) {
            urls.push(Resources.MESHES_PATH + meshesData[i].src);
        }

        const meshes = [];
        return Promise.all(urls.map(url =>
            fetch(url).then(resp => resp.text())
        )).then(texts => {
            for (let i = 0; i < meshesData.length; i++) {
                const mesh = meshesData[i];
                let m = null;
                switch(mesh.type) {
                    case Resources.FileTypes.OBJ:
                    m = new Mesh(new OBJModel(texts[i]).toIndexedModel());
                    break;
                    case Resources.FileTypes.FBX:
                    break;
                }

                if(m) meshes.push(m);
            }
            return meshes;
        }).
        catch(error => {
            throw new Error(error);  
        });
    }

    static async loadTextures(texturesData) {
        return "textures";
    }

    static async loadAudios(audiosData) {
        return "audios";
    }
}

Resources.Data = null;
Resources.Meshes = null;
Resources.Textures = null;
Resources.Audios = null;
Resources.PATH = "./resources/";
Resources.MESHES_PATH = "./resources/meshes/";
Resources.TEXTURES_PATH = "./resources/textures/";
Resources.AUDIOS_PATH = "./resources/audios/";

Resources.FileTypes = {
    FBX: "fbx",
    OBJ: "obj",
    JPG: "jpg",
    PNG: "png",
    MP3: "mp3",
    OGG: "ogg"
}

export default Resources;



// class Resources {

//     constructor(data, callback, context) {

//         // LOCAL ?
//         // this.root = "resources/" :
//         // this.root = "https://brunoperry.net/demoscene/propsmaquina/resources/";


//         this.root = "resources/";
//         this.callback = callback;
//         this.context = context;

//         //Bitmap[]
//         this.atlasMap = null;
//         this.textures = [];
//         this.texturesLoaded = false;
//         this.audios = [];
//         this.audiosLoaded = false;
//         this.audioContext = new AudioContext();
//         this.font = [];
//         this.fontLoaded = false;

//         //Mesh[]
//         this.meshes = [];
//         this.meshesLoaded = false;

//         this.tagAscii = data.tagASCII;

//         var instance = this;

//         //KEYFRAMES:
//         this.keyframes = data.keyframes;

//         this.createTextures(data.atlas, data.textures, function() {
//             instance.createFont(data.font, function() {
//                 instance.createAudios(data.audios, function() {
//                     instance.createMeshes(data.meshes);
//                 });
//             });
//         });

//         //props;
//         this.props = data.props;
//         this.props2 = data.props2;
//     }

//     createTextures(atlas, data, cb) {

//         this.callback(Resources.state.LOADING_TEXTURES);

//         var instance = this;

//         var image = new Image();
//         image.onload = function() {

//             instance.atlasMap = this;

//             var canvas = document.createElement("canvas");
//             canvas.width = atlas.w;
//             canvas.height = atlas.h;
//             var ctx = canvas.getContext("2d");
//             ctx.drawImage(this, 0, 0);

//             var d;
//             var bmps;
//             var srcData;
//             var copiedData;
//             var sliceX;
//             var sliceY;
//             var sliceW;
//             var sliceH;

//             for(var i = 0; i < data.length; i++) {

//                 bmps = [];
//                 d = data[i];
//                 if(d.spritesH) {
//                     var da;
//                     var sw = d.w / d.spritesH;
//                     var sh = d.h / d.spritesV

//                     var numSprites = d.spritesH * d.spritesV;
//                     var row = 0;
//                     var col = 0;
//                     for(var j = 0; j < numSprites; j++) {

//                         sliceX  = d.x + (sw * col);
//                         sliceY  = d.y + (sh * row);
//                         sliceW  = sw;
//                         sliceH  = sh;

//                         srcData = ctx.getImageData(sliceX, sliceY, sliceW, sliceH);

//                         copiedData = new Uint8ClampedArray(srcData.data.length);
//                         copiedData.set(srcData.data);
//                         bmps.push(new Bitmap( {
//                             w: sliceW,
//                             h: sliceH,
//                             imgData: copiedData,
//                             rad: 1,
//                             name: d.name,
//                             mode: parseInt(d.mode)
//                         }));

//                         col++;
//                         if(col >= d.spritesH) {
//                             col = 0;
//                             row++;
//                         }
//                     }
//                 } else {

//                     sliceX  = d.x;
//                     sliceY  = d.y;
//                     sliceW  = d.w;
//                     sliceH  = d.h;
//                     srcData = ctx.getImageData(sliceX, sliceY, sliceW, sliceH);
//                     copiedData = new Uint8ClampedArray(srcData.data.length);
//                     copiedData.set(srcData.data);
//                     bmps.push(new Bitmap( {
//                         w: sliceW, 
//                         h: sliceH,
//                         imgData: copiedData,
//                         rad: 1,
//                         name: d.name,
//                         mode: parseInt(d.mode)
//                     }));
//                 }

//                 instance.textures.push(new Texture({
//                     id: d.id,
//                     bmps: bmps,
//                     type: d.type
//                 }));
//             }

//             instance.texturesLoaded = true;
//             instance.checkLoadingComplete();

//             cb();
//         }
//         image.src = this.root + atlas.url;
//     }

//     createFont(data, cb) {


//         this.callback(Resources.state.LOADING_FONT);

//         var canvas = document.createElement("canvas");
//         canvas.width = this.atlasMap.width;
//         canvas.height = this.atlasMap.height;
//         var ctx = canvas.getContext("2d");
//         ctx.drawImage(this.atlasMap, 0, 0);

//         var d;
//         var bmps;
//         var srcData;
//         var copiedData;
//         var sliceX;
//         var sliceY;
//         var sliceW;
//         var sliceH;

//         for(var i = 0; i < data.length; i++) {

//             bmps = [];
//             d = data[i];
//             if(d.spritesH) {
//                 var da;
//                 var sw = d.w / d.spritesH;
//                 var sh = d.h / d.spritesV

//                 var numSprites = d.spritesH * d.spritesV;
//                 var row = 0;
//                 var col = 0;
//                 for(var j = 0; j < numSprites; j++) {

//                     sliceX  = d.x + (sw * col);
//                     sliceY  = d.y + (sh * row);
//                     sliceW  = sw;
//                     sliceH  = sh;

//                     srcData = ctx.getImageData(sliceX, sliceY, sliceW, sliceH);

//                     copiedData = new Uint8ClampedArray(srcData.data.length);
//                     copiedData.set(srcData.data);
//                     bmps.push(new Bitmap( {
//                         w: sliceW,
//                         h: sliceH,
//                         imgData: copiedData,
//                         rad: 1,
//                         name: d.name,
//                         mode: parseInt(d.mode)
//                     }));

//                     col++;
//                     if(col >= d.spritesH) {
//                         col = 0;
//                         row++;
//                     }
//                 }
//             } else {

//                 sliceX  = d.x;
//                 sliceY  = d.y;
//                 sliceW  = d.w;
//                 sliceH  = d.h;
//                 srcData = ctx.getImageData(sliceX, sliceY, sliceW, sliceH);
//                 copiedData = new Uint8ClampedArray(srcData.data.length);
//                 copiedData.set(srcData.data);
//                 bmps.push(new Bitmap( {
//                     w: sliceW,
//                     h: sliceH,
//                     imgData: copiedData,
//                     rad: 1,
//                     name: d.name,
//                     mode: parseInt(d.mode)
//                 }));
//             }

//             this.font.push(new Texture({
//                 id: d.id,
//                 bmps: bmps
//             }));
//         }

//         this.fontLoaded = true;
//         this.checkLoadingComplete();

//         cb();
//     }

//     createAudios(data, cb) {

//         var totalAudios = data.length;
//         this.callback(Resources.state.LOADING_AUDIO,  " (1/" + totalAudios + ")");
//         var counter = 0;
//         var instance = this;
//         for (var i = 0; i < data.length; i++) {
//             Utils.loadFile(data[i].id, this.root + data[i].url, function(loadedData, id) {
//                 var id = id;

//                 instance.audioContext.decodeAudioData(loadedData, function(buffer) {
//                     instance.audios.push(new AudioSource(id, instance.audioContext, buffer));
//                     counter++;
//                     instance.callback(Resources.state.LOADING_AUDIO, " (" + (counter + 1) + "/" + totalAudios + ")");
//                     if(counter === totalAudios) {
//                         instance.audios.sort(function(a, b) {
//                             return a.id-b.id;
//                         });
//                         instance.audiosLoaded = true;
//                         instance.checkLoadingComplete();
//                         cb();
//                     }
//                 });
//             }, "arraybuffer");
//         }
//     }

//     createMeshes(data) {

//         this.callback(Resources.state.LOADING_MESHES);
//         var totalMeshes = data.length;
//         var counter = 0;
//         var instance = this;

//         for(var i = 0; i < data.length; i++) {

//             var callback = function(data) {

//                 var mesh = new Mesh(data);
//                 instance.meshes.push(mesh);
//                 counter++;
//                 if(counter === totalMeshes) {
//                     instance.meshesLoaded = true;
//                     instance.checkLoadingComplete();
//                 }
//             }

//             switch(data[i].type) {

//                 case Resources.fileType.FBX:
//                     FBXLoader.loadFile(this.root + data[i].url, callback);
//                     break;

//                 case Resources.fileType.OBJ:
//                     var model = new OBJModel().loadFile(data[i].name + i.toString(), data[i].id, this.root + data[i].url, callback);
//                     break;
//             }
//         }
//     }

//     checkLoadingComplete() {

//         if( this.fontLoaded && this.texturesLoaded && this.audiosLoaded && this.meshesLoaded ) {
//             this.callback(Resources.state.LOADING_COMPLETE);
//         }
//     }

//     //GETTERS SETTERS
//     getKeyframes() {
//         return this.keyframes;
//     }
//     getData() {
//         return {
//             textures: this.textures,
//             audios: this.audios,
//             meshes: this.meshes,
//             keyframes: this.keyframes
//         }
//     }
//     getTexture(id) {

//         for(var i = 0; i < this.textures.length; i++) {
//             if(this.textures[i].id == id) {
//                 return this.textures[i];
//             }
//         }
//         return null;
//     }
//     getMesh(id) {

//         for(var i = 0; i < this.meshes.length; i++) {

//             if(this.meshes[i].id == id) {
//                 return this.meshes[i];
//             }
//         }
//         return null;
//     }
//     getAudio(id) {

//         for(var i = 0; i < this.audios.length; i++) {

//             if(this.audios[i].id == id) {
//                 return this.audios[i];
//             }
//         }
//         return null;
//     }
//     getAudioContext(id) {

//         return this.audioContext;
//     }
//     getAudios() {
//         return this.audios;
//     }
//     getTag() {
//         return this.tagAscii;
//     }
//     getProps() {
//         return this.props;
//     }
//     getProps2() {
//         return this.props2;
//     }
//     getFont() {
//         return this.font;
//     }
//     getChar(id) {

//         for(var i = 0; i < this.font.length; i++) {
//             if(this.font[i].bmp.name === id) {
//                 return this.font[i].bmp;
//             }
//         }
//         return null;
//     }
// }


// Resources.state = {
//     LOADING_TEXTURES: "loading textures",
//     LOADING_AUDIO: "loading audio",
//     LOADING_MESHES: "loading meshes",
//     LOADING_FONT: "loading font",
//     LOADING_COMPLETE: "loading complete"
// }

// Resources.fileType = {
//     FBX: "fbx",
//     OBJ: "obj",
//     JPG: "jpg",
//     PNG: "png",
//     MP3: "mp3",
//     OGG: "ogg"
// }