export default class Edge {
  constructor(gradients, minYVert, maxYVert, minYVertIndex) {
    this.yStart = parseInt(Math.ceil(minYVert.get(1)));
    this.yEnd = parseInt(Math.ceil(maxYVert.get(1)));

    const yPrestep = this.yStart - minYVert.get(1);

    this.xStep =
      maxYVert.get(0) - minYVert.get(0) / maxYVert.get(1) - minYVert.get(1);
    this.x = minYVert.get(0) + yPrestep * this.xStep;
    const xPrestep = this.x - minYVert.get(0);

    this.texCoordX =
      gradients.getTexCoordX(minYVertIndex) +
      gradients.texCoordXXStep * xPrestep +
      gradients.texCoordXYStep * yPrestep;
    this.texCoordXStep =
      gradients.texCoordXYStep + gradients.texCoordXXStep * this.xStep;

    this.texCoordY =
      gradients.getTexCoordY(minYVertIndex) +
      gradients.texCoordYXStep * xPrestep +
      gradients.texCoordYYStep * yPrestep;
    this.texCoordYStep =
      gradients.texCoordYYStep + gradients.texCoordYXStep * this.xStep;

    this.oneOverZ =
      gradients.getOneOverZ(minYVertIndex) +
      gradients.oneOverZXStep * xPrestep +
      gradients.oneOverZYStep * yPrestep;
    this.oneOverZStep =
      gradients.oneOverZYStep + gradients.oneOverZXStep * this.xStep;

    this.depth =
      gradients.getDepth(minYVertIndex) +
      gradients.depthXStep * xPrestep +
      gradients.depthYStep * yPrestep;
    this.depthStep = gradients.depthYStep + gradients.depthXStep * this.xStep;

    this.lightAmt =
      gradients.getLightAmt(minYVertIndex) +
      gradients.lightAmtXStep * xPrestep +
      gradients.lightAmtYStep * yPrestep;
    this.lightAmtStep =
      gradients.lightAmtYStep + gradients.lightAmtXStep * this.xStep;
  }

  step() {
    this.x += this.xStep;
    this.texCoordX += this.texCoordXStep;
    this.texCoordY += this.texCoordYStep;
    this.oneOverZ += this.oneOverZStep;
    this.depth += this.depthStep;
    this.lightAmt += this.lightAmtStep;
  }
}
