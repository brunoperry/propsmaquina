class Util {

    constructor() { };

    static removeEmptyStrings(data) {
        var result = [];
        for (var i = 0; i < data.length; i++)
            if (data[i] !== "")
                result.push(data[i]);

        return result;
    }
}

export default Util;