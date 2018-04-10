class Vec2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
}

export default Vec2;