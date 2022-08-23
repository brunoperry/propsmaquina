import GVector from "../math/GVector.js";
import Utils from "../Utils.js";
import Loader from "./Loader.js";

export default class OBJLoader extends Loader {
  static async load({ url, name = "unamed" }) {
    const req = await fetch(url);
    const data = await req.text();

    return OBJLoader.#parse(data, name);
  }

  static #parse(data, name) {
    const lines = data.split("\n");
    let tokens;

    let positions = [];
    let texCoords = [];
    let normals = [];
    let indices = [];
    for (var i = 0; i < lines.length; i++) {
      tokens = lines[i].split(" ");
      tokens = Utils.removeEmptyStrings(tokens);

      if (tokens.length === 0 || tokens[0] === "#") {
        continue;
      } else if (tokens[0] === "v") {
        positions.push(
          new GVector(
            parseFloat(tokens[1]),
            parseFloat(tokens[2]),
            parseFloat(tokens[3]),
            1
          )
        );
      } else if (tokens[0] === "vt") {
        texCoords.push(
          new GVector(parseFloat(tokens[1]), 1.0 - parseFloat(tokens[2]), 0, 0)
        );
      } else if (tokens[0] === "vn") {
        normals.push(
          new GVector(
            parseFloat(tokens[1]),
            parseFloat(tokens[2]),
            parseFloat(tokens[3]),
            0
          )
        );
      } else if (tokens[0] === "f") {
        for (let j = 0; j < tokens.length - 3; j++) {
          indices.push(OBJLoader.#parseOBJIndex(tokens[1]));
          indices.push(OBJLoader.#parseOBJIndex(tokens[2 + j]));
          indices.push(OBJLoader.#parseOBJIndex(tokens[3 + j]));
        }
      }
    }

    return OBJLoader.toIndexedModel({
      indices: indices,
      positions: positions,
      texCoords: texCoords,
      normals: normals,
      name: name,
    });
  }

  static #parseOBJIndex(token) {
    var values = token.split("/");

    var result = new OBJIndex();
    result.setVertexIndex(parseInt(values[0]) - 1);

    if (values.length > 1) {
      if (values[1] !== "") {
        this.hasTexCoords = true;
        result.setTexCoordIndex(parseInt(values[1]) - 1);
      }

      if (values.length > 2) {
        this.hasNormals = true;
        result.setNormalIndex(parseInt(values[2]) - 1);
      }
    }

    return result;
  }
}

OBJLoader.Tag = {
  VERTICES: "v ",
  UV: "vt ",
  NORMALS: "n ",
};

class OBJIndex {
  constructor() {
    this.vertextIndex;
    this.texCoordIndex;
    this.normalIndex;
  }

  equals(obj) {
    return (
      this.vertextIndex === obj.vertextIndex &&
      this.texCoordIndex === obj.texCoordIndex &&
      this.normalIndex === obj.normalIndex
    );
  }

  hashCode() {
    const MULTIPLIER = 31;

    let result = 17;

    result = MULTIPLIER * result + this.vertextIndex;
    result = MULTIPLIER * result + this.texCoordIndex;
    result = MULTIPLIER * result + this.normalIndex;

    return result;
  }

  // GETTERS SETTERS

  getVertexIndex() {
    return this.vertextIndex;
  }
  getTexCoordIndex() {
    return this.texCoordIndex;
  }
  getNormalIndex() {
    return this.normalIndex;
  }
  setVertexIndex(val) {
    this.vertextIndex = val;
  }
  setTexCoordIndex(val) {
    this.texCoordIndex = val;
  }
  setNormalIndex(val) {
    this.normalIndex = val;
  }
}
