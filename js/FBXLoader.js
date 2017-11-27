class FBXLoader {

    constructor() {
    }

    static vertListToVecList(verts) {

        var vecs = [];
        var vec = null;
        for(var i = 0; i < verts.length / 3; i++) {

            vec = new Vec4( parseFloat(verts[i * 3 + 0]),
                            parseFloat(verts[i * 3 + 1]),
                            parseFloat(verts[i * 3 + 2],
                            1) );
            vecs.push(vec);
        }
        return vecs;
    }

    static indicesListToFacesList(indices) {

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

    static UVListToVecList(uvs, indices) {

        var texCoords = [];
        var uv;

        //make the uvs 2 dimensional array to be easier for the index pick up
        var uvs2 = [];
        for(var i = 0; i < uvs.length; i += 2) {
            var u = uvs[i];
            var v = uvs[i + 1]
            uvs2[i] = [u, v];
        }
        //clean up undefined values
        var tmpuvs2 = [];
        for(var i = 0; i < uvs2.length; i++) {
            if(uvs2[i] !== undefined) {
                tmpuvs2.push(uvs2[i]);
            }
        }
        uvs2 = tmpuvs2;

        for(var i = 0; i < indices.length / 2; i ++) {

            uv = new Vec4(  parseFloat(uvs2[parseInt(indices[i])]),
                            parseFloat(uvs2[parseInt(indices[i + 1])]),
                            0,
                            0 );

            texCoords.push(uv);
        }

        return texCoords;
    }

    static loadFile(url, callback) {

        var client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = function() {

            if(client.readyState === 4 && client.status === 200) {
                complete(client.responseText)
            }
        }
        client.send();

        var dataOut = {};

        var complete = function(data) {

            //PARSE VERTICES
            var verts = [];
            var tmpStr = "";
            var index = data.search(FBXLoader.Tag.VERTICES) + FBXLoader.Tag.VERTICES.length;
            for (var i = index; i < data.length; i++) {

                if(data.charAt(i) === "P") break;
                tmpStr += data.charAt(i);
            }
            var vertsStr = tmpStr.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
            dataOut.vertices = FBXLoader.vertListToVecList(vertsStr.split(","));

            //PARSE INDICES OF VERTICES (TRIANGLES)
            var indices = [];
            tmpStr = "";
            index = data.search(FBXLoader.Tag.POLY_VERTEX_INDEX) + FBXLoader.Tag.POLY_VERTEX_INDEX.length;
            for (var i = index; i < data.length; i++) {

                if(data.charAt(i) === "E") break;
                tmpStr += data.charAt(i);
            }
            var indicesStr = tmpStr.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
            dataOut.indices = FBXLoader.indicesListToFacesList(indicesStr.split(","));

            //PARSE UVS
            var uvs = [];
            tmpStr = "";
            index = data.search(FBXLoader.Tag.UV) + FBXLoader.Tag.UV.length;
            for(var i = index; i < data.length; i++) {
                if(data.charAt(i) === "U") break;
                tmpStr += data.charAt(i);
            }
            var uvsStr = tmpStr.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
            //PARSE UVS INDICES
            tmpStr = "";
            index = data.search(FBXLoader.Tag.UV_INDEX) + FBXLoader.Tag.UV_INDEX.length;
            for(var i = index; i < data.length; i++) {
                if(data.charAt(i) === "}") break;
                tmpStr += data.charAt(i);
            }
            var uvsIndicesStr = tmpStr.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ');
            dataOut.uvs = FBXLoader.UVListToVecList(uvsStr.split(","), uvsIndicesStr.split(","));

            callback(dataOut);
        }
    }
}

FBXLoader.Tag = {
    VERTICES: "Vertices: ",
    POLY_VERTEX_INDEX: "PolygonVertexIndex: ",
    UV: "UVs: ",
    UV_INDEX: "UVIndex: "
}