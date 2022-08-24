import GVector from "./GVector.js";

export default class Gradients {
  constructor(minYVert, midYVert, maxYVert) {
    var oneOverDx =
      1.0 /
      ((midYVert.position.x - maxYVert.position.x) *
        (minYVert.position.y - maxYVert.position.y) -
        (minYVert.position.x - maxYVert.position.x) *
          (midYVert.position.y - maxYVert.position.y));

    var oneOverDy = -oneOverDx;

    this.texCoordX = [];
    this.texCoordY = [];
    this.oneOverZ = [];
    this.depth = [];
    this.lightAmt = [];

    //OCCLUSION
    this.depth[0] = minYVert.position.z;
    this.depth[1] = midYVert.position.z;
    this.depth[2] = maxYVert.position.z;

    //TEX PERSPECTIVE
    this.oneOverZ[0] = 1.0 / minYVert.position.w;
    this.oneOverZ[1] = 1.0 / midYVert.position.w;
    this.oneOverZ[2] = 1.0 / maxYVert.position.w;

    this.texCoordX[0] = minYVert.texCoords.x * this.oneOverZ[0];
    this.texCoordX[1] = midYVert.texCoords.x * this.oneOverZ[1];
    this.texCoordX[2] = maxYVert.texCoords.x * this.oneOverZ[2];

    this.texCoordY[0] = minYVert.texCoords.y * this.oneOverZ[0];
    this.texCoordY[1] = midYVert.texCoords.y * this.oneOverZ[1];
    this.texCoordY[2] = maxYVert.texCoords.y * this.oneOverZ[2];

    this.texCoordXXStep = this.calcXStep(
      this.texCoordX,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDx
    );
    this.texCoordXYStep = this.calcYStep(
      this.texCoordX,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDy
    );
    this.texCoordYXStep = this.calcXStep(
      this.texCoordY,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDx
    );
    this.texCoordYYStep = this.calcYStep(
      this.texCoordY,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDy
    );
    this.oneOverZXStep = this.calcXStep(
      this.oneOverZ,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDx
    );
    this.oneOverZYStep = this.calcYStep(
      this.oneOverZ,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDy
    );

    //OCCLUSION
    this.depthXStep = this.calcXStep(
      this.depth,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDx
    );
    this.depthYStep = this.calcYStep(
      this.depth,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDy
    );

    //LIGHTING
    //tmp
    var lightDir = new GVector(0, 0.5, -1);
    this.lightAmt[0] = this.saturate(minYVert.normal.dot(lightDir)) * 0.9 + 0.2;
    this.lightAmt[1] = this.saturate(midYVert.normal.dot(lightDir)) * 0.9 + 0.2;
    this.lightAmt[2] = this.saturate(maxYVert.normal.dot(lightDir)) * 0.9 + 0.2;

    this.lightAmtXStep = this.calcXStep(
      this.lightAmt,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDx
    );
    this.lightAmtYStep = this.calcYStep(
      this.lightAmt,
      minYVert,
      midYVert,
      maxYVert,
      oneOverDy
    );
  }

  //param: float, returns: float
  saturate(val) {
    if (val < 0.0) return 0.0;
    if (val > 1.0) return 1.0;
    return val;
  }

  //floats[], vertex, vertex, vertex, float
  calcXStep(values, minYVert, midYVert, maxYVert, oneOverDx) {
    return (
      ((values[1] - values[2]) * (minYVert.y - maxYVert.y) -
        (values[0] - values[2]) * (midYVert.y - maxYVert.y)) *
      oneOverDx
    );
  }
  //floats[], vertex, vertex, vertex, float
  calcYStep(values, minYVert, midYVert, maxYVert, oneOverDy) {
    return (
      ((values[1] - values[2]) * (minYVert.x - maxYVert.x) -
        (values[0] - values[2]) * (midYVert.x - maxYVert.x)) *
      oneOverDy
    );
  }

  // GETTERS / SETTERS
  getTexCoordX(loc) {
    return this.texCoordX[loc];
  }
  getTexCoordY(loc) {
    return this.texCoordY[loc];
  }
  getOneOverZ(loc) {
    return this.oneOverZ[loc];
  }
  getDepth(loc) {
    return this.depth[loc];
  }
  getLightAmt(loc) {
    return this.lightAmt[loc];
  }
}
