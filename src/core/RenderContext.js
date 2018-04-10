import Bitmap from "./Bitmap.js";
import Mat4 from "./math/Mat4.js";
import Gradients from "./math/Gradients.js";
import Edge from "./math/Edge.js";

class RenderContext extends Bitmap {

    constructor(data) {
        super(data);

        this.zBuffer = [];
        this.zBuffer.length = this.width * this.height;

        this.showEdges = false;
        this.vertices = [];
    }

    clearDepthBuffer() {

        for (let i = 0; i < zBuffer.length; i++) {
            this.zBuffer[i] = Number.MAX_VALUE;
        }
    }

    //Vertex, Vertex, Vertex, Bitmap
    drawTriangle(v1, v2, v3, texture) {

        if (v1.isInsideViewFrustum() &&
            v2.isInsideViewFrustum() &&
            v3.isInsideViewFrustum()) {

            this.fillTriangle(v1, v2, v3, texture);
            return;
        }

        this.vertices = [v1, v2, v3];

        if (this.clipPolygonAxis(this.vertices, 0) &&
            this.clipPolygonAxis(this.vertices, 1) &&
            this.clipPolygonAxis(this.vertices, 2)) {

            const initialVertex = this.vertices[0];
            for (let i = 1; i < this.vertices.length - 1; i++) {
                this.fillTriangle(initialVertex, this.vertices[i], this.vertices[i + 1], texture)
            }
        }
    }

    //Vertex[], Vertex[], int
    clipPolygonAxis(vertices, componentindex) {

        const auxillaryList = [];

        this.clipPolygonComponent(this.vertices, componentindex, 1.0, auxillaryList);
        this.vertices = [];

        if (auxillaryList.length === 0) {
            return false;
        }
        this.clipPolygonComponent(auxillaryList, componentindex, -1.0, this.vertices);

        return this.vertices.length > 0;
    }
    //Vertex[], int, float, Vertex[]
    clipPolygonComponent(vertices, componentIndex, componentFactor, result) {

        let previousVertex = vertices[vertices.length - 1];
        let previousComponent = previousVertex.get(componentIndex) * componentFactor;
        let previousInside = previousComponent <= previousVertex.getPosition().getW();

        const it = this.makeIterator(vertices);
        while (it.hasNext()) {

            const currentVertex = it.next().value;
            const currentComponent = currentVertex.get(componentIndex) * componentFactor;
            const currentInside = currentComponent <= currentVertex.getPosition().getW();

            if (currentInside ^ previousInside) {

                const lerpAmt = (previousVertex.getPosition().getW() - previousComponent) /
                    ((previousVertex.getPosition().getW() - previousComponent) -
                        (currentVertex.getPosition().getW() - currentComponent));

                result.push(previousVertex.lerp(currentVertex, lerpAmt));
            }

            if (currentInside) {
                result.push(currentVertex);
            }

            previousVertex = currentVertex;
            previousComponent = currentComponent;
            previousInside = currentInside;
        }
    }

    fillTriangle(v1, v2, v3, texture) {

        const screenSpaceTransform = new Mat4().screenSpaceTransform(this.width / 2, this.height / 2);

        const identity = new Mat4().identity();

        let minYVert = v1.transform(screenSpaceTransform, identity).perspectiveDivide();
        let midYVert = v2.transform(screenSpaceTransform, identity).perspectiveDivide();
        let maxYVert = v3.transform(screenSpaceTransform, identity).perspectiveDivide();

        if (minYVert.triangleAreaTimesTwo(maxYVert, midYVert) >= 0) {
            return;
        }

        let tmp;
        if (maxYVert.get(1) < midYVert.get(1)) {
            tmp = maxYVert;
            maxYVert = midYVert;
            midYVert = tmp;
        }
        if (midYVert.get(1) < minYVert.get(1)) {
            tmp = midYVert;
            midYVert = minYVert;
            minYVert = tmp;
        }
        if (maxYVert.get(1) < midYVert.get(1)) {
            tmp = maxYVert;
            maxYVert = midYVert;
            midYVert = tmp;
        }

        this.scanTriangle(minYVert, midYVert, maxYVert, minYVert.triangleAreaTimesTwo(maxYVert, midYVert) >= 0, texture);
    }

    scanTriangle(minYVert, midYVert, maxYVert, handedness, texture) {

        const gradients = new Gradients(minYVert, midYVert, maxYVert);

        const topToBottom = new Edge(gradients, minYVert, maxYVert, 0);
        const topToMiddle = new Edge(gradients, minYVert, midYVert, 0);
        const middleToBottom = new Edge(gradients, midYVert, maxYVert, 1);

        this.scanEdges(gradients, topToBottom, topToMiddle, handedness, texture);
        this.scanEdges(gradients, topToBottom, middleToBottom, handedness, texture);
    }
}

export default RenderContext;