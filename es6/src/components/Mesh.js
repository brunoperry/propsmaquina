import Vertex from "../math/Vertex.js";
import Triangle from "./Triangle.js";

export default class Mesh {
  #meshData;
  #vertices = [];
  #indices;

  triangles = [];
  texture = null;
  constructor(data) {
    if (!data) return;

    this.#meshData = data;
    this.#vertices = [];

    for (let i = 0; i < data.positions.length; i++) {
      this.#vertices.push(
        new Vertex(data.positions[i], data.texCoords[i], data.normals[i])
      );
    }

    this.#indices = data.indices;
    for (let i = 0; i < this.#indices.length; i += 3) {
      this.triangles.push(
        new Triangle(
          this.#vertices[this.#indices[i]],
          this.#vertices[this.#indices[i + 1]],
          this.#vertices[this.#indices[i + 2]],
          data.texture
        )
      );
    }
  }

  transform({ mvp, transform }) {
    this.triangles.forEach((tri) => {
      tri.transform(mvp, transform);
    });

    return this.triangles;
  }

  setTexture(texture) {
    this.texture = texture;
    this.triangles.forEach((tri) => (tri.texture = this.texture));
  }

  //GETTERS SETTERS
  getVertex(i) {
    return this.#vertices[i];
  }
  getIndex(i) {
    return this.#indices[i];
  }
  getNumIndices() {
    return this.#indices.length;
  }
  clone() {
    return new Mesh(this.#meshData);
  }

  get name() {
    return this.#meshData.name;
  }
}
