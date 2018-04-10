class Time {

    constructor() { }
    
    static getTime() {
        return Date.now();
    }
    static getDelta() {
        return Time.delta;
    }
    static setDelta(delta) {
        Time.delta = delta;
    }
}

Time.SECOND = 1000;
Time.delta = 0;

export default Time;