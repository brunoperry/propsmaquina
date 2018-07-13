import Vertex from "./Vertex.js";

class Mesh {

    constructor(data) {

        if(!data) return;

        this.meshData = data;
        this.vertices = [];
        this.id = data.id;
        this.name = data.name;

        for(let i = 0; i < data.getPositions().length; i++) {
			this.vertices.push(new Vertex(
                data.getPositions()[i],
                data.getTexCoords()[i],
                data.getNormals()[i]));
		}
        this.indices = data.getIndices();
    }

    //context, Mat4, Mat4, Bitmap
    draw(context, viewProjection, transform, texture) {

        const mvp = viewProjection.multiply(transform);
        for(let i = 0; i < this.indices.length; i += 3) {

            context.drawTriangle(
					this.vertices[this.indices[i]].transform(mvp, transform),
					this.vertices[this.indices[i + 1]].transform(mvp, transform),
					this.vertices[this.indices[i + 2]].transform(mvp, transform),
                    texture.bitmap);
        }
    }

    //GETTERS SETTERS
    getVertex(i) {return this.vertices[i]; }
    getIndex(i) {return this.indices[i]; }
    getNumIndices() {return this.indices.length; }
    clone() { return new Mesh(this.meshData); }
}

export default Mesh;