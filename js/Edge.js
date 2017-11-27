class Edge {

    constructor(gradients, minYVert, maxYVert, minYVertIndex) {

        this.yStart = parseInt(Math.ceil(minYVert.get(1)));
        this.yEnd = parseInt(Math.ceil(maxYVert.get(1)));

        var yDist = maxYVert.get(1) - minYVert.get(1);
        var xDist = maxYVert.get(0) - minYVert.get(0);

        var yPrestep = this.yStart - minYVert.get(1);
        this.xStep = xDist / yDist;
        this.x = minYVert.get(0) + yPrestep * this.xStep;
        var xPrestep = this.x - minYVert.get(0);

        this.texCoordX = gradients.getTexCoordX(minYVertIndex) +
			gradients.getTexCoordXXStep() * xPrestep +
			gradients.getTexCoordXYStep() * yPrestep;
		this.texCoordXStep = gradients.getTexCoordXYStep() + gradients.getTexCoordXXStep() * this.xStep;

        this.texCoordY = gradients.getTexCoordY(minYVertIndex) +
			gradients.getTexCoordYXStep() * xPrestep +
			gradients.getTexCoordYYStep() * yPrestep;
		this.texCoordYStep = gradients.getTexCoordYYStep() + gradients.getTexCoordYXStep() * this.xStep;

        this.oneOverZ = gradients.getOneOverZ(minYVertIndex) +
			gradients.getOneOverZXStep() * xPrestep +
			gradients.getOneOverZYStep() * yPrestep;
		this.oneOverZStep = gradients.getOneOverZYStep() + gradients.getOneOverZXStep() * this.xStep;

        this.depth = gradients.getDepth(minYVertIndex) + 
            gradients.getDepthXStep() * xPrestep + 
            gradients.getDepthYStep() * yPrestep;
        this.depthStep = gradients.getDepthYStep() + gradients.getDepthXStep() * this.xStep;

        this.lightAmt = gradients.getLightAmt(minYVertIndex) + 
            gradients.getLightAmtXStep() * xPrestep + 
            gradients.getLightAmtYStep() * yPrestep;
        this.lightAmtStep = gradients.getLightAmtYStep() + gradients.getLightAmtXStep() * this.xStep;
    }

    step() {
        this.x += this.xStep;
		this.texCoordX += this.texCoordXStep;
		this.texCoordY += this.texCoordYStep;
		this.oneOverZ += this.oneOverZStep;
		this.depth += this.depthStep;
		this.lightAmt += this.lightAmtStep;
    }

    getYStart() { return this.yStart; }
    getYEnd() { return this.yEnd };
    getX() { return this.x };
	getTexCoordX() { return this.texCoordX; }
	getTexCoordY() { return this.texCoordY; }
	getOneOverZ() { return this.oneOverZ; }
    getDepth() {return this.depth; }
    getLightAmt() {return this.lightAmt; }
}