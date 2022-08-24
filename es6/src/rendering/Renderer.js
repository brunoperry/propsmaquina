import Edge from "../math/Edge.js";
import GMatrix from "../math/GMatrix.js";
import Gradients from "../math/Gradients.js";
import Bitmap from "./Bitmap.js";

export class Renderer extends Bitmap {
  #zBuffer;
  #currentTexture;
  constructor(w, h) {
    super({
      width: w,
      height: h,
    });

    this.#zBuffer = [];
    this.#zBuffer.length = this.width * this.height;

    this.showEdges = false;
    this.vertices = [];
  }

  clearDepthBuffer() {
    for (var i = 0; i < this.#zBuffer.length; i++) {
      this.#zBuffer[i] = Number.MAX_VALUE;
    }
  }

  //FIX THIS SHIT...
  drawLine(x1, y1, x2, y2, col = Color.white) {
    // delta of exact value and rounded value of the dependant variable
    var d = 0;

    var dy = Math.abs(y2 - y1);
    var dx = Math.abs(x2 - x1);

    var dy2 = dy << 1; // slope scaling factors to avoid floating
    var dx2 = dx << 1; // point

    var ix = x1 < x2 ? 1 : -1; // increment direction
    var iy = y1 < y2 ? 1 : -1;
    if (dy <= dx) {
      for (var k = 0; k < dx; k++) {
        this.drawPixel(parseInt(x1), parseInt(y1), col.r, col.g, col.b, col.a);

        // plot(g, x1, y1);
        if (x1 == x2) break;
        x1 += ix;
        d += dy2;
        if (d > dx) {
          y1 += iy;
          d -= dx2;
        }
      }
    } else {
      for (var k = 0; k < dx; k++) {
        this.drawPixel(parseInt(x1), parseInt(y1), col.r, col.g, col.b, col.a);
        // plot(g, x1, y1);
        if (y1 == y2) break;
        y1 += iy;
        d += dx2;
        if (d > dy) {
          x1 += ix;
          d -= dy2;
        }
      }
    }
  }

  drawCurve(points, col = Color.white) {
    var pA;
    var pB;

    var screenSpaceTransform = new GMatrix().screenSpaceTransform(
      this.width / 2,
      this.height / 2
    );
    var identity;

    for (var i = 0; i < points.length - 1; i++) {
      identity = new GMatrix().identity();
      pA = points[i]
        .transform(screenSpaceTransform, identity)
        .perspectiveDivide();
      pB = points[i + 1]
        .transform(screenSpaceTransform, identity)
        .perspectiveDivide();
      this.drawLine(pA.get(0), pA.get(1), pB.get(0), pB.get(1));
    }
  }

  drawTangents(points, col = Color.white) {
    var pA;
    var pB;
    var screenSpaceTransform = new GMatrix().screenSpaceTransform(
      this.width / 2,
      this.height / 2
    );

    for (var i = 0; i < points.length; i++) {
      var identity = new GMatrix().identity();
      pA = points[i].a
        .transform(screenSpaceTransform, identity)
        .perspectiveDivide();
      pB = points[i].b
        .transform(screenSpaceTransform, identity)
        .perspectiveDivide();
      this.drawLine(pA.get(0), pA.get(1), pB.get(0), pB.get(1), col);
    }
  }

  render() {}

  drawTriangles(tris) {
    for (let i = 0; i < tris.length; i++) this.drawTriangle(tris[i]);
  }
  //Vertex, Vertex, Vertex, Bitmap
  drawTriangle(triangle) {
    this.#currentTexture = triangle.texture;
    if (triangle.isInsideViewFrustum) {
      this.#fillTriangle(
        triangle.a,
        triangle.b,
        triangle.c,
        triangle.texture.bitmap
      );
      return;
    }

    this.vertices = [triangle.a, triangle.b, triangle.c];
    if (
      this.#clipPolygonAxis(0) &&
      this.#clipPolygonAxis(1) &&
      this.#clipPolygonAxis(2)
    ) {
      const tex = triangle.texture;
      for (var i = 1; i < this.vertices.length - 1; i++) {
        this.#fillTriangle(
          this.vertices[0],
          this.vertices[i],
          this.vertices[i + 1],
          tex
        );
      }
    }
  }

  /** FUNC
   * @param {number} componentindex some number
   * @return {boolean}
   */
  #clipPolygonAxis(componentindex) {
    let auxillaryList = [];

    this.#clipPolygonComponent(
      this.vertices,
      componentindex,
      1.0,
      auxillaryList
    );

    if (!auxillaryList.length) return false;

    this.vertices = [];
    this.#clipPolygonComponent(
      auxillaryList,
      componentindex,
      -1.0,
      this.vertices
    );

    return this.vertices.length > 0;
  }
  #clipPolygonComponent(vertices, componentIndex, componentFactor, result) {
    let prevVrtx = vertices[vertices.length - 1];
    let prevComp = prevVrtx.get(componentIndex) * componentFactor;
    let prevInside = prevComp <= prevVrtx.position.w;

    for (let i = 0; i < vertices.length; i++) {
      const vrtx = vertices[i];

      const currComp = vrtx.get(componentIndex) * componentFactor;
      const currInside = currComp <= vrtx.position.w;

      if (currInside ^ prevInside) {
        result.push(
          prevVrtx.lerp(
            vrtx,
            (prevVrtx.position.w - prevComp) /
              (prevVrtx.position.w - prevComp - (vrtx.position.w - currComp))
          )
        );
      }

      if (currInside) result.push(vrtx);

      prevVrtx = vrtx;
      prevComp = currComp;
      prevInside = currInside;
    }
  }

  #fillTriangle(v1, v2, v3) {
    const screenSpaceTransform = new GMatrix().screenSpaceTransform(
      this.width / 2,
      this.height / 2
    );

    const identity = new GMatrix().identity();
    let minYVert = v1
      .transform(screenSpaceTransform, identity)
      .perspectiveDivide();
    let midYVert = v2
      .transform(screenSpaceTransform, identity)
      .perspectiveDivide();
    let maxYVert = v3
      .transform(screenSpaceTransform, identity)
      .perspectiveDivide();

    if (minYVert.triangleAreaTimesTwo(maxYVert, midYVert) >= 0) return;

    if (maxYVert.get(1) < midYVert.get(1)) {
      const tmp = maxYVert;
      maxYVert = midYVert;
      midYVert = tmp;
    }
    if (midYVert.get(1) < minYVert.get(1)) {
      const tmp = midYVert;
      midYVert = minYVert;
      minYVert = tmp;
    }
    if (maxYVert.get(1) < midYVert.get(1)) {
      const tmp = maxYVert;
      maxYVert = midYVert;
      midYVert = tmp;
    }

    //Scan triangle
    const gradients = new Gradients(minYVert, midYVert, maxYVert);

    const topToBottom = new Edge(gradients, minYVert, maxYVert, 0);
    const topToMiddle = new Edge(gradients, minYVert, midYVert, 0);
    const middleToBottom = new Edge(gradients, midYVert, maxYVert, 1);

    const handedness = minYVert.triangleAreaTimesTwo(maxYVert, midYVert) >= 0;
    this.#scanEdges(gradients, topToBottom, topToMiddle, handedness);
    this.#scanEdges(gradients, topToBottom, middleToBottom, handedness);
  }

  #scanEdges(gradients, a, b, handedness) {
    let left = a;
    let right = b;

    if (handedness) {
      const tmp = left;
      left = right;
      right = tmp;
    }

    for (let j = b.yStart; j < b.yEnd; j++) {
      this.#drawScanLine(gradients, left, right, j);
      left.step();
      right.step();
    }
  }

  #drawScanLine(gradients, left, right, j) {
    const xMin = parseInt(Math.ceil(left.x));
    const xPrestep = xMin - left.x;

    const xDist = right.x - left.x;
    const texCoordsXXStep = (right.texCoordX - left.texCoordX) / xDist;
    const texCoordsYXStep = (right.texCoordY - left.texCoordY) / xDist;
    const oneOverZXStep = (right.oneOverZ - left.oneOverZ) / xDist;
    const depthXStep = (right.depth - left.depth) / xDist;
    const lightAmtXStep = gradients.lightAmtXStep;

    let texCoordX = left.texCoordX + texCoordsXXStep * xPrestep;
    let texCoordY = left.texCoordY + texCoordsYXStep * xPrestep;
    let oneOverZ = left.oneOverZ + oneOverZXStep * xPrestep;
    let depth = left.depth + depthXStep * xPrestep;
    let lightAmt = left.lightAmt + lightAmtXStep * xPrestep;

    const bmp = this.#currentTexture.bitmap;

    for (let i = xMin; i < parseInt(Math.ceil(right.x)); i++) {
      const index = i + j * this.width;
      if (depth < this.#zBuffer[index]) {
        const z = 1.0 / oneOverZ;
        this.#zBuffer[index] = depth;
        this.copyPixel(
          i,
          j,
          parseInt(texCoordX * z * (this.#currentTexture.width - 1) + 0.5),
          parseInt(texCoordY * z * (this.#currentTexture.height - 1) + 0.5),
          bmp,
          1
        );
      }

      oneOverZ += oneOverZXStep;
      texCoordX += texCoordsXXStep;
      texCoordY += texCoordsYXStep;
      depth += depthXStep;
      lightAmt += lightAmtXStep;
    }
  }
}
