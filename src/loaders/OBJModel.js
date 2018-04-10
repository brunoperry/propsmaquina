import Util from "../utils/Util.js";
import Vec4 from "../core/math/Vec4.js";
import IndexedModel from "./IndexedModel.js";

class OBJModel {
    constructor(data) {

        this.positions = [];
        this.texCoords = [];
        this.normals = [];
        this.indices = [];
        this.hasTexCoords = false;
        this.hasNormals = false;

        this.parse(data);
    }

    parse(modelData) {

        const lines = modelData.split("\n");
        for(let i = 0; i < lines.length; i++) {
            const tokens = Util.removeEmptyStrings(lines[i].split(" "));

            if(tokens.length === 0 || tokens[0] === "#") {
                continue;
            }
            else if(tokens[0] === "v") {
                this.positions.push(new Vec4(parseFloat(tokens[1]),
                                             parseFloat(tokens[2]),
                                             parseFloat(tokens[3]),1));
            } else if(tokens[0] === "vt") {
                    
                this.texCoords.push(new Vec4(parseFloat(tokens[1]),
						                    1.0 -  parseFloat(tokens[2]),0,0));

                                             
            } else if(tokens[0] === "vn") {
				this.normals.push(new Vec4( parseFloat(tokens[1]),
                                            parseFloat(tokens[2]),
                                            parseFloat(tokens[3]),0));
			} else if(tokens[0] === "f") {

				for(let j = 0; j < tokens.length - 3; j++) {

					this.indices.push(this.parseOBJIndex(tokens[1]));
					this.indices.push(this.parseOBJIndex(tokens[2 + j]));
					this.indices.push(this.parseOBJIndex(tokens[3 + j]));
				}
			}
        }
        // this.callback(this.toIndexedModel());
    }
    parseOBJIndex(token) {

        const values = token.split("/");
        const result = new OBJIndex();
        result.setVertexIndex(parseInt(values[0]) - 1);

        if(values.length > 1)
        {
            if(values[1] !== "")
            {
                this.hasTexCoords = true;
                result.setTexCoordIndex(parseInt(values[1]) - 1);
            }

            if(values.length > 2)
            {
                this.hasNormals = true;
                result.setNormalIndex(parseInt(values[2]) - 1);
            }
        }

        return result;
    }

    toIndexedModel() {

        var result = new IndexedModel(this.id, this.name);
		var normalModel = new IndexedModel();
		var resultIndexMap = [];
		var normalIndexMap = [];
		var indexMap = [];

		for(var i = 0; i < this.indices.length; i++) {

			var currentIndex = this.indices[i];

			var currentPosition = this.positions[currentIndex.getVertexIndex()];
			var currentTexCoord;
			var currentNormal;

			if(this.hasTexCoords)
				currentTexCoord = this.texCoords[currentIndex.getTexCoordIndex()];
			else
				currentTexCoord = new Vec4(0,0,0,0);

			if(this.hasNormals)
				currentNormal = this.normals[currentIndex.getNormalIndex()];
			else
				currentNormal = new Vec4(0,0,0,0);

			var modelVertexIndex = resultIndexMap[currentIndex];

			if(modelVertexIndex == null)
			{
				modelVertexIndex = result.getPositions().length;
				resultIndexMap.push({
                    currentIndex: currentIndex, 
                    modelVertexIndex: modelVertexIndex });

				result.getPositions().push(currentPosition);
				result.getTexCoords().push(currentTexCoord);
				if(this.hasNormals)
					result.getNormals().push(currentNormal);
			}

			var normalModelIndex = normalIndexMap[currentIndex.getVertexIndex()];

			if(normalModelIndex === undefined) {
				normalModelIndex = normalModel.getPositions().length;
				normalIndexMap.push(
                    {
                        currentIndex: currentIndex.getVertexIndex(), 
                        normalModelIndex: normalModelIndex
                    });

				normalModel.getPositions().push(currentPosition);
				normalModel.getTexCoords().push(currentTexCoord);
				normalModel.getNormals().push(currentNormal);
				normalModel.getTangents().push(new Vec4(0,0,0,0));
			}

			result.getIndices().push(modelVertexIndex);
			normalModel.getIndices().push(normalModelIndex);
			indexMap.push({
                modelVertexIndex: modelVertexIndex, 
                normalModelIndex: normalModelIndex
            });
		}

		if(!this.hasNormals)
		{
			normalModel.calcNormals();

			for(var i = 0; i < result.getPositions().length; i++)
				result.getNormals().push(normalModel.getNormals()[indexMap[i]]);
		}

		normalModel.calcTangents();

		for(var i = 0; i < result.getPositions().length; i++)
			result.getTangents().push(normalModel.getTangents()[indexMap[i]]);

		return result;
	}
}

class OBJIndex {

    constructor() {
        this.vertextIndex;
        this.texCoordIndex;
        this.normalIndex;
    }

    equals(obj) {
        const index = obj;

        return  this.vertextIndex === index.vertextIndex &&
                this.texCoordIndex === index.texCoordIndex &&
                this.normalIndex === index.normalIndex;
    }

    hashCode() {
        const BASE = 17;
        const MULTIPLIER = 31;

        let result = BASE;

        result = MULTIPLIER * result + this.vertextIndex;
        result = MULTIPLIER * result + this.texCoordIndex;
        result = MULTIPLIER * result + this.normalIndex;

        return result;
    }

    // GETTERS SETTERS
    
    getVertexIndex() { return this.vertextIndex; }
    getTexCoordIndex() { return this.texCoordIndex; }
    getNormalIndex() { return this.normalIndex; }
    setVertexIndex(val) { this.vertextIndex = val; }
    setTexCoordIndex(val) { this.texCoordIndex = val; }
    setNormalIndex(val) { this.normalIndex = val; }
}

export default OBJModel;