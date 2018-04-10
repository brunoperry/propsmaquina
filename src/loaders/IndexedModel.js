import Vec4 from "../core/math/Vec4.js";

class IndexedModel {

    //params int
    constructor(id = -1, name = "") {

        // Vec4[]
        this.positions = [];

        // Vec4[]
        this.texCoords = [];

        // Vec4[]
        this.normals = [];

        // Vec4[]
        this.tangents = [];

        // int[]
        this.indices = [];

        this.id = id;

        this.name = name;
    }

    calcNormals() {

        for (let i = 0; i < this.indices.length; i += 3) {

            const i0 = this.indices[i];
            const i1 = this.indices[i + 1];
            const i2 = this.indices[i + 2];

            const v1 = this.positions[i1].subtractVec(this.positions[i0]);
            const v2 = this.positions[i2].subtractVec(this.positions[i0]);

            const normal = v1.cross(v2).normalized();

            this.normals.push(i0, this.normals[i0].addVec(normal));
            this.normals.push(i1, this.normals[i1].addVec(normal));
            this.normals.push(i2, this.normals[i2].addVec(normal));
        }

        for (let i = 0; i < this.normals.length; i++)
            this.normals.push(i, this.normals[i].normalized());
    }

    calcTangents() {
        for (let i = 0; i < this.indices.length; i += 3) {
            const i0 = this.indices[i];
            const i1 = this.indices[i + 1];
            const i2 = this.indices[i + 2];
            if (this.positions[i0] === undefined ||
                this.positions[i1] === undefined ||
                this.positions[i2] === undefined) continue;
            const edge1 = this.positions[i1].subtractVec(this.positions[i0]);
            const edge2 = this.positions[i2].subtractVec(this.positions[i0]);

            const deltaU1 = this.texCoords[i1].getX() - this.texCoords[i0].getX();
            const deltaV1 = this.texCoords[i1].getY() - this.texCoords[i0].getY();
            const deltaU2 = this.texCoords[i2].getX() - this.texCoords[i0].getX();
            const deltaV2 = this.texCoords[i2].getY() - this.texCoords[i0].getY();

            const dividend = (deltaU1 * deltaV2 - deltaU2 * deltaV1);
            const f = dividend == 0 ? 0.0 : 1.0 / dividend;

            const tangent = new Vec4(
                f * (deltaV2 * edge1.getX() - deltaV1 * edge2.getX()),
                f * (deltaV2 * edge1.getY() - deltaV1 * edge2.getY()),
                f * (deltaV2 * edge1.getZ() - deltaV1 * edge2.getZ()),
                0);

            this.tangents.push(i0, this.tangents[i0].addVec(tangent));
            this.tangents.push(i1, this.tangents[i1].addVec(tangent));
            this.tangents.push(i2, this.tangents[i2].addVec(tangent));
        }
    }

    // GETTERS SETTERS
    getPositions() { return this.positions; }
    getTexCoords() { return this.texCoords; }
    getNormals() { return this.normals; }
    getTangents() { return this.tangents; }
    getIndices() { return this.indices; }
    getID() { return this.id; }
}

export default IndexedModel;


