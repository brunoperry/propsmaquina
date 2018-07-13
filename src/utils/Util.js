class Util {

    constructor() { };

    static removeEmptyStrings(data) {
        var result = [];
        for (var i = 0; i < data.length; i++)
            if (data[i] !== "")
                result.push(data[i]);

        return result;
    }

    static toRadians(angle) {
        return (angle / 180) * Math.PI;
    }
}

export default Util;