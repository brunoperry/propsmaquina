class RenderContext extends Bitmap {

    constructor(w, h) {
        super({
            w: w,
            h: h
        });

        this.zBuffer = [];
        this.zBuffer.length = this.width * this.height;

        this.showEdges = false;
        this.vertices = [];
    }

    clearDepthBuffer() {
        for(var i = 0; i < this.zBuffer.length; i++) {
            this.zBuffer[i] = Number.MAX_VALUE;
        }
    }

    //FIX THIS SHIT...
    drawLine(x1, y1, x2, y2, col=Color.white) {
        // delta of exact value and rounded value of the dependant variable
        var d = 0;

        var dy = Math.abs(y2 - y1);
        var dx = Math.abs(x2 - x1);
 
        var dy2 = (dy << 1); // slope scaling factors to avoid floating
        var dx2 = (dx << 1); // point
 
        var ix = x1 < x2 ? 1 : -1; // increment direction
        var iy = y1 < y2 ? 1 : -1;
        if (dy <= dx) {
            for (var k = 0; k < dx; k++) {
                this.drawPixel(parseInt(x1), parseInt(y1), col.r, col.g, col.b, col.a);
        
                // plot(g, x1, y1);
                if (x1 == x2)
                    break;
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
                if (y1 == y2)
                    break;
                y1 += iy;
                d += dx2;
                if (d > dy) {
                    x1 += ix;
                    d -= dy2;
                }
            }
        }
    }

    drawCurve(points, col=Color.white) {

        var pA;
        var pB;

        var screenSpaceTransform = new Mat4().screenSpaceTransform(this.width / 2, this.height / 2);
        var identity;

        for(var i = 0; i < points.length - 1; i++ ) {

            identity = new Mat4().identity();
            pA = points[i].transform(screenSpaceTransform, identity).perspectiveDivide();
            pB = points[i + 1].transform(screenSpaceTransform, identity).perspectiveDivide();
            this.drawLine(pA.get(0), pA.get(1), pB.get(0), pB.get(1));
        }
    }

    drawTangents(points, col=Color.white) {

        var pA;
        var pB;
        var screenSpaceTransform = new Mat4().screenSpaceTransform(this.width / 2, this.height / 2);

        for(var i = 0; i < points.length; i++) {

            var identity = new Mat4().identity();
            pA = points[i].a.transform(screenSpaceTransform, identity).perspectiveDivide();
            pB = points[i].b.transform(screenSpaceTransform, identity).perspectiveDivide();
            this.drawLine(pA.get(0), pA.get(1), pB.get(0), pB.get(1), col);
        }
    }

    render() {

        
    }

    //Vertex, Vertex, Vertex, Bitmap
    drawTriangle(v1, v2, v3, texture) {

        if( v1.isInsideViewFrustum() && 
            v2.isInsideViewFrustum() && 
            v3.isInsideViewFrustum() ) {

            this.fillTriangle(v1, v2, v3, texture);
            return;
        }

        this.vertices = [v1, v2, v3];

        if( this.clipPolygonAxis(this.vertices, 0) &&
            this.clipPolygonAxis(this.vertices, 1) &&
            this.clipPolygonAxis(this.vertices, 2)) {

                var initialVertex = this.vertices[0];
                for(var i = 1; i < this.vertices.length - 1; i++) {
                    this.fillTriangle(initialVertex, this.vertices[i], this.vertices[i + 1], texture)
                }
        }
    }

    //Vertex[], Vertex[], int
    clipPolygonAxis(vertices, componentindex) {

        var auxillaryList = [];

        this.clipPolygonComponent(this.vertices, componentindex, 1.0, auxillaryList);
        this.vertices = [];

        if(auxillaryList.length === 0) {
            return false;
        }
        this.clipPolygonComponent(auxillaryList, componentindex, -1.0, this.vertices);

        return this.vertices.length > 0;
    }
    //Vertex[], int, float, Vertex[]
    clipPolygonComponent(vertices, componentIndex, componentFactor, result) {

        var previousVertex = vertices[vertices.length - 1];
        var previousComponent = previousVertex.get(componentIndex) * componentFactor;
        var previousInside = previousComponent <= previousVertex.getPosition().getW();

        var it = this.makeIterator(vertices);
        while(it.hasNext()) {
            
            var currentVertex = it.next().value;
            var currentComponent = currentVertex.get(componentIndex) * componentFactor;
			var currentInside = currentComponent <= currentVertex.getPosition().getW();

            if(currentInside ^ previousInside) {

				var lerpAmt = (previousVertex.getPosition().getW() - previousComponent) /
					((previousVertex.getPosition().getW() - previousComponent) - 
					 (currentVertex.getPosition().getW() - currentComponent));

				result.push(previousVertex.lerp(currentVertex, lerpAmt));
			}

            if(currentInside) {
				result.push(currentVertex);
			}

			previousVertex = currentVertex;
			previousComponent = currentComponent;
			previousInside = currentInside;
        }
    }

    fillTriangle(v1, v2, v3, texture) {

        var screenSpaceTransform = new Mat4().screenSpaceTransform(this.width / 2, this.height / 2);

        var identity = new Mat4().identity();

        var minYVert = v1.transform(screenSpaceTransform, identity).perspectiveDivide();
        var midYVert = v2.transform(screenSpaceTransform, identity).perspectiveDivide();
        var maxYVert = v3.transform(screenSpaceTransform, identity).perspectiveDivide();

        if(minYVert.triangleAreaTimesTwo(maxYVert, midYVert) >= 0) {
            return;
        }

        if(maxYVert.get(1) < midYVert.get(1)) {
            var tmp = maxYVert;
            maxYVert = midYVert;
            midYVert = tmp;
        }
        if(midYVert.get(1) < minYVert.get(1)) {
            var tmp = midYVert;
            midYVert = minYVert;
            minYVert = tmp;
        }
        if(maxYVert.get(1) < midYVert.get(1)) {
            var tmp = maxYVert;
            maxYVert = midYVert;
            midYVert = tmp;
        }

        this.scanTriangle(minYVert, midYVert, maxYVert, minYVert.triangleAreaTimesTwo(maxYVert, midYVert) >= 0, texture);
    }

    scanTriangle(minYVert, midYVert, maxYVert, handedness, texture) {

        var gradients = new Gradients(minYVert, midYVert, maxYVert);

        var topToBottom    = new Edge(gradients, minYVert, maxYVert, 0);
        var topToMiddle    = new Edge(gradients, minYVert, midYVert, 0);
        var middleToBottom = new Edge(gradients, midYVert, maxYVert, 1);

        this.scanEdges(gradients, topToBottom, topToMiddle, handedness, texture);
        this.scanEdges(gradients, topToBottom, middleToBottom, handedness, texture);
    }

    scanEdges(gradients, a, b, handedness, texture) {

        var left = a;
        var right = b;

        if(handedness) {
            var tmp = left;
            left = right;
            right = tmp;
        }
        
        var yStart = b.getYStart();
        var yEnd = b.getYEnd();

        for(var j = yStart; j < yEnd; j++) {
            this.drawScanLine(gradients, left, right, j, texture);
            left.step();
            right.step();
        }
    }

    drawScanLine(gradients, left, right, j, texture) {

        var xMin = parseInt(Math.ceil(left.getX()));
        var xMax = parseInt(Math.ceil(right.getX()));
        var xPrestep = xMin - left.getX();

        var xDist = right.getX() - left.getX();
		var texCoordsXXStep = (right.getTexCoordX() - left.getTexCoordX()) / xDist;
		var texCoordsYXStep = (right.getTexCoordY() - left.getTexCoordY()) / xDist;
		var oneOverZXStep = (right.getOneOverZ() - left.getOneOverZ()) / xDist;
		var depthXStep = (right.getDepth() - left.getDepth()) / xDist;
        var lightAmtXStep = gradients.getLightAmtXStep();

        var texCoordX = left.getTexCoordX() + texCoordsXXStep * xPrestep;
        var texCoordY = left.getTexCoordY() + texCoordsYXStep * xPrestep;
        var oneOverZ = left.getOneOverZ() + oneOverZXStep * xPrestep;
        var depth = left.getDepth() + depthXStep * xPrestep;
        var lightAmt = left.getLightAmt() + lightAmtXStep * xPrestep;
        
        for(var i = xMin; i < xMax; i++) {

            var index = i + j * this.getWidth()
            if(depth < this.zBuffer[index]) {
                
                this.zBuffer[index] = depth;
                var z = 1.0 / oneOverZ;
                var srcX = parseInt( ((texCoordX * z) * (texture.getWidth() - 1) + 0.5) );
                var srcY = parseInt( ((texCoordY * z) * (texture.getHeight() - 1) + 0.5) );

                if(texture.useLight) {
                    this.copyPixel(i, j, srcX, srcY, texture, lightAmt * texture.getRadiance());
                } else {
                    this.copyPixel(i, j, srcX, srcY, texture, 1);
                }

                if(this.showEdges) {
                    if(i === xMin || i + 1 === xMax) {
                        this.drawPixel(i, j, 0xff, 0, 0, 0xff);
                    }
                }
            }
            
            oneOverZ += oneOverZXStep;
            texCoordX += texCoordsXXStep;
            texCoordY += texCoordsYXStep;
            depth += depthXStep;
            lightAmt += lightAmtXStep;
        }
    }

    
    
    makeIterator(array) {
        var nextIndex = 0;
        return {
            next: function() {
                return nextIndex < array.length ?
                    {value: array[nextIndex++], done: false} :
                    {done: true};
            },
            hasNext: function() {
                return nextIndex < array.length;
            }
        };
    }
}