import GVector from "../math/GVector.js";

export default class Loader {
  static toIndexedModel({ indices, positions, texCoords, normals, name }) {
    const result = new IndexedModel(name);
    var normalModel = new IndexedModel(name);
    var resultIndexMap = [];
    var normalIndexMap = [];
    var indexMap = [];

    for (let i = 0; i < indices.length; i++) {
      const currentIndex = indices[i];
      const currentPosition = positions[currentIndex.getVertexIndex()];
      let currentTexCoord;
      let currentNormal;

      texCoords
        ? (currentTexCoord = texCoords[currentIndex.getTexCoordIndex()])
        : (currentTexCoord = new GVector(0, 0, 0, 0));

      normals
        ? (currentNormal = normals[currentIndex.getNormalIndex()])
        : (currentNormal = new GVector(0, 0, 0, 0));

      let modelVertexIndex = resultIndexMap[currentIndex];
      if (!modelVertexIndex) {
        modelVertexIndex = result.positions.length;
        resultIndexMap.push({
          currentIndex: currentIndex,
          modelVertexIndex: modelVertexIndex,
        });

        result.positions.push(currentPosition);
        result.texCoords.push(currentTexCoord);
        if (this.hasNormals) result.normals.push(currentNormal);
      }

      let normalModelIndex = normalIndexMap[currentIndex.getVertexIndex()];

      if (!normalModelIndex) {
        normalModelIndex = normalModel.positions.length;
        normalIndexMap.push({
          currentIndex: currentIndex.getVertexIndex(),
          normalModelIndex: normalModelIndex,
        });

        normalModel.positions.push(currentPosition);
        normalModel.texCoords.push(currentTexCoord);
        normalModel.normals.push(currentNormal);
        normalModel.getTangents().push(new GVector(0, 0, 0, 0));
      }

      result.indices.push(modelVertexIndex);
      normalModel.indices.push(normalModelIndex);
      indexMap.push({
        modelVertexIndex: modelVertexIndex,
        normalModelIndex: normalModelIndex,
      });
    }

    if (!this.hasNormals) {
      normalModel.calcNormals();

      for (var i = 0; i < result.positions.length; i++)
        result.normals.push(normalModel.normals[indexMap[i]]);
    }

    normalModel.calcTangents();

    for (var i = 0; i < result.positions.length; i++)
      result.getTangents().push(normalModel.getTangents()[indexMap[i]]);

    return result;
  }
}
class IndexedModel {
  constructor(name) {
    this.positions = [];
    this.texCoords = [];
    this.normals = [];
    this.tangents = [];
    this.indices = [];
    this.name = name;
  }

  calcNormals() {
    for (var i = 0; i < this.indices.length; i += 3) {
      var i0 = this.indices[i];
      var i1 = this.indices[i + 1];
      var i2 = this.indices[i + 2];

      var v1 = this.positions[i1].subtractVec(this.positions[i0]);
      var v2 = this.positions[i2].subtractVec(this.positions[i0]);

      var normal = v1.cross(v2).normalized();

      this.normals.push(i0, this.normals[i0].addVec(normal));
      this.normals.push(i1, this.normals[i1].addVec(normal));
      this.normals.push(i2, this.normals[i2].addVec(normal));
    }

    for (var i = 0; i < this.normals.length; i++)
      this.normals.push(i, this.normals[i].normalized());
  }

  calcTangents() {
    for (var i = 0; i < this.indices.length; i += 3) {
      var i0 = this.indices[i];
      var i1 = this.indices[i + 1];
      var i2 = this.indices[i + 2];

      if (
        this.positions[i0] === undefined ||
        this.positions[i1] === undefined ||
        this.positions[i2] === undefined
      )
        continue;

      var edge1 = this.positions[i1].subtractVec(this.positions[i0]);
      var edge2 = this.positions[i2].subtractVec(this.positions[i0]);

      var deltaU1 = this.texCoords[i1].getX() - this.texCoords[i0].getX();
      var deltaV1 = this.texCoords[i1].getY() - this.texCoords[i0].getY();
      var deltaU2 = this.texCoords[i2].getX() - this.texCoords[i0].getX();
      var deltaV2 = this.texCoords[i2].getY() - this.texCoords[i0].getY();

      var dividend = deltaU1 * deltaV2 - deltaU2 * deltaV1;
      var f = dividend == 0 ? 0.0 : 1.0 / dividend;

      var tangent = new GVector(
        f * (deltaV2 * edge1.getX() - deltaV1 * edge2.getX()),
        f * (deltaV2 * edge1.getY() - deltaV1 * edge2.getY()),
        f * (deltaV2 * edge1.getZ() - deltaV1 * edge2.getZ()),
        0
      );

      this.tangents.push(i0, this.tangents[i0].addVec(tangent));
      this.tangents.push(i1, this.tangents[i1].addVec(tangent));
      this.tangents.push(i2, this.tangents[i2].addVec(tangent));
    }

    // for(var i = 0; i < this.tangents.length; i++)

    // console.log(this.tangents[i]);
    // this.tangents.push(i, this.tangents[i].normalized());
  }
  getTangents() {
    return this.tangents;
  }
}
