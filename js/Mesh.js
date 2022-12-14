class Mesh {
  constructor(data) {
    if (!data) return;

    this.meshData = data;
    this.vertices = [];
    this.id = data.id;
    this.name = data.name;

    for (var i = 0; i < data.getPositions().length; i++) {
      this.vertices.push(
        new Vertex(data.getPositions()[i], data.getTexCoords()[i], data.getNormals()[i])
      );
    }
    this.indices = data.getIndices();
  }

  //context, Mat4, Mat4, Bitmap
  draw(context, viewProjection, transform, texture) {
    var mvp = viewProjection.multiply(transform);

    // const a = this.vertices[this.indices[0]].transform(mvp, transform);
    // const b = this.vertices[this.indices[1]].transform(mvp, transform);
    // const c = this.vertices[this.indices[2]].transform(mvp, transform);

    for (var i = 0; i < this.indices.length; i += 3) {
      const a = this.vertices[this.indices[i]].transform(mvp, transform);
      const b = this.vertices[this.indices[i + 1]].transform(mvp, transform);
      const c = this.vertices[this.indices[i + 2]].transform(mvp, transform);

      context.drawTriangle(a, b, c, texture.bmp);

      //   context.drawTriangle(
      //     this.vertices[this.indices[i]].transform(mvp, transform),
      //     this.vertices[this.indices[i + 1]].transform(mvp, transform),
      //     this.vertices[this.indices[i + 2]].transform(mvp, transform),
      //     texture.bmp
      //   );
    }
  }

  //GETTERS SETTERS
  getVertex(i) {
    return this.vertices[i];
  }
  getIndex(i) {
    return this.indices[i];
  }
  getNumIndices() {
    return this.indices.length;
  }
  clone() {
    return new Mesh(this.meshData);
  }
}
