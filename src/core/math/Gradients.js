class Gradients {

    constructor(minYVert, midYVert, maxYVert) {

        const oneOverDx = 1.0 /
            (((midYVert.getPosition().x - maxYVert.getPosition().x) *
                (minYVert.getPosition().y - maxYVert.getPosition().y)) -
                ((minYVert.getPosition().x - maxYVert.getPosition().x) *
                    (midYVert.getPosition().y - maxYVert.getPosition().y)));

        const oneOverDy = -oneOverDx;

        this.texCoordX = [];
        this.texCoordY = [];
        this.oneOverZ = [];
        this.depth = [];
        this.lightAmt = [];

        //OCCLUSION
        this.depth[0] = minYVert.getPosition().getZ();
        this.depth[1] = midYVert.getPosition().getZ();
        this.depth[2] = maxYVert.getPosition().getZ();

        //TEX PERSPECTIVE
        this.oneOverZ[0] = 1.0 / minYVert.getPosition().getW();
        this.oneOverZ[1] = 1.0 / midYVert.getPosition().getW();
        this.oneOverZ[2] = 1.0 / maxYVert.getPosition().getW();

        this.texCoordX[0] = minYVert.getTexCoords().getX() * this.oneOverZ[0];
        this.texCoordX[1] = midYVert.getTexCoords().getX() * this.oneOverZ[1];
        this.texCoordX[2] = maxYVert.getTexCoords().getX() * this.oneOverZ[2];

        this.texCoordY[0] = minYVert.getTexCoords().getY() * this.oneOverZ[0];
        this.texCoordY[1] = midYVert.getTexCoords().getY() * this.oneOverZ[1];
        this.texCoordY[2] = maxYVert.getTexCoords().getY() * this.oneOverZ[2];

        this.texCoordXXStep = this.calcXStep(this.texCoordX, minYVert, midYVert, maxYVert, oneOverDx);
        this.texCoordXYStep = this.calcYStep(this.texCoordX, minYVert, midYVert, maxYVert, oneOverDy);
        this.texCoordYXStep = this.calcXStep(this.texCoordY, minYVert, midYVert, maxYVert, oneOverDx);
        this.texCoordYYStep = this.calcYStep(this.texCoordY, minYVert, midYVert, maxYVert, oneOverDy);
        this.oneOverZXStep = this.calcXStep(this.oneOverZ, minYVert, midYVert, maxYVert, oneOverDx);
        this.oneOverZYStep = this.calcYStep(this.oneOverZ, minYVert, midYVert, maxYVert, oneOverDy);

        //OCCLUSION
        this.depthXStep = this.calcXStep(this.depth, minYVert, midYVert, maxYVert, oneOverDx);
        this.depthYStep = this.calcYStep(this.depth, minYVert, midYVert, maxYVert, oneOverDy);

        //LIGHTING
        //tmp
        const lightDir = new Vec4(0, .5, -1);
        this.lightAmt[0] = this.saturate(minYVert.getNormal().dot(lightDir)) * 0.9 + 0.2;
        this.lightAmt[1] = this.saturate(midYVert.getNormal().dot(lightDir)) * 0.9 + 0.2;
        this.lightAmt[2] = this.saturate(maxYVert.getNormal().dot(lightDir)) * 0.9 + 0.2;

        this.lightAmtXStep = this.calcXStep(this.lightAmt, minYVert, midYVert, maxYVert, oneOverDx);
        this.lightAmtYStep = this.calcYStep(this.lightAmt, minYVert, midYVert, maxYVert, oneOverDy);
    }

    //param: float, returns: float
    saturate(val) {
        if (val < 0.0) return 0.0;
        if (val > 1.0) return 1.0;
        return val;
    }

    //floats[], vertex, vertex, vertex, float
    calcXStep(values, minYVert, midYVert, maxYVert, oneOverDx) {
        return (((values[1] - values[2]) *
            (minYVert.get(1) - maxYVert.get(1))) -
            ((values[0] - values[2]) *
                (midYVert.get(1) - maxYVert.get(1)))) * oneOverDx
    }
    //floats[], vertex, vertex, vertex, float
    calcYStep(values, minYVert, midYVert, maxYVert, oneOverDy) {

        return (((values[1] - values[2]) *
            (minYVert.get(0) - maxYVert.get(0))) -
            ((values[0] - values[2]) *
                (midYVert.get(0) - maxYVert.get(0)))) * oneOverDy
    }

    // GETTERS / SETTERS
    getTexCoordX(loc) { return this.texCoordX[loc]; }
    getTexCoordY(loc) { return this.texCoordY[loc]; }
    getOneOverZ(loc) { return this.oneOverZ[loc]; }
    getDepth(loc) { return this.depth[loc]; }
    getLightAmt(loc) { return this.lightAmt[loc]; }

    getTexCoordXXStep() { return this.texCoordXXStep; }
    getTexCoordXYStep() { return this.texCoordXYStep; }
    getTexCoordYXStep() { return this.texCoordYXStep; }
    getTexCoordYYStep() { return this.texCoordYYStep; }

    getOneOverZXStep() { return this.oneOverZXStep; }
    getOneOverZYStep() { return this.oneOverZYStep; }

    getDepthXStep() { return this.depthXStep; }
    getDepthYStep() { return this.depthYStep; }

    getLightAmtXStep() { return this.lightAmtXStep; }
    getLightAmtYStep() { return this.lightAmtYStep; }
}

export default Gradients;