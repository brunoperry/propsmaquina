class Color {

    constructor(r=0xff,g=0xff,b=0xff,a=0xff) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    mul(value) {

        this.r = this.r * value;
        this.g = this.g * value;
        this.b = this.b * value;
    }
    
    static blendAlpha(cs, cd, alpha) {

        if(alpha === 0) return cd;
        if(alpha === 1) return cs;
        
        return new Color(
            alpha * cs.r + (1-alpha) * cd.r,
            alpha * cs.g + (1-alpha) * cd.g,
            alpha * cs.b + (1-alpha) * cd.b
        );
    }
}

Color.white = {
    r: 0xff,
    g: 0xff,
    b: 0xff,
    a: 0xff
}

Color.red = {
    r: 0xff,
    g: 0x00,
    b: 0x00,
    a: 0xff
}

Color.green = {
    r: 0x00,
    g: 0xff,
    b: 0x00,
    a: 0xff
}

Color.blue = {
    r: 0x00,
    g: 0x00,
    b: 0xff,
    a: 0xff
}