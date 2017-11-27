class OBJLoader {

    constructor() {

    }

    static loadFile(url, callback) {

        var client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = function() {

            if(client.readyState === 4 && client.status === 200) {
                parse(client.responseText)
            }
        }
        client.send();

        var dataOut = {};

        var parse = function(data) {

            var indexStart;
            var tmpStr = "";

            //Parse vertices list
            indexStart = data.search(OBJLoader.Tag.VERTICES);
            var verts = [];
            for(var i = indexStart; i < data.length; i++) {
                if(data.charAt( i ) === "v" && data.charAt( i + 1) === "t") {
                    break;
                }
                tmpStr += data.charAt(i);
            }
            var vertsStr = tmpStr.replace(/v/g, "");
            vertsStr = vertsStr.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
            if(vertsStr.charAt(0) === " ") {
                vertsStr = vertsStr.substring(1);
            }
            dataOut.vertices = OBJLoader.parseVertices(vertsStr.split(" "));

            //Parse texCoords
            indexStart = data.search(OBJLoader.Tag.UV);
            tmpStr = "";
            var uvs = [];
            for(var i = indexStart; i < data.length; i++) {
                if(data.charAt( i ) === "v" && data.charAt( i + 1) === "n") {
                    break;
                }
                tmpStr += data.charAt(i);
            }
            var uvsStr = tmpStr.replace(/vt/g, "");
            var uvs = [];
            uvsStr = uvsStr.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
            if(uvsStr.charAt(0) === " ") {
                uvsStr = uvsStr.substring(1);
            }
            uvs = OBJLoader.parseUVs(uvsStr.split(" "));
        }

        return null;
    }

    static parseVertices(verts) {

        var vecs = [];
        var vec = null;
        for(var i = 0; i < verts.length / 3; i ++) {
            vec = new Vec4( parseFloat(verts[i * 3 + 0]),
                            parseFloat(verts[i * 3 + 1]),
                            parseFloat(verts[i * 3 + 2],
                            1) );
            vecs.push(vec);
        }
        return vecs;
    }

    static parseUVs(verts) {

        var vecs = [];
        var vec = null;
        for(var i = 0; i < verts.length / 3; i ++) {
            vec = new Vec4( parseFloat(verts[i * 3 + 0]),
                            parseFloat(verts[i * 3 + 1]),
                            parseFloat(verts[i * 3 + 2],
                            1) );
            vecs.push(vec);
        }
        return vecs;
    }

    static parseVerticesIndices(indices) {

        var tmpInt;
        var faces = [];
        for(var i = 0; i < indices.length; i++) {
            tmpInt = parseInt(indices[i]);
            if(tmpInt < 0) {
                faces.push( (-1 * (tmpInt) -1) );
            } else {
                faces.push( tmpInt );
            }
        }
        return faces;

    }
}

OBJLoader.Tag = {
    VERTICES: "v ",
    UV: "vt ",
}