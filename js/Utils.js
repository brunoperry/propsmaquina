class Utils {

    static toRadians(angle) {
        return (angle/180) * Math.PI;
    }

    static getInt64Bytes( x ){
        var bytes = [];
        var i = 8;
        do {
            bytes[--i] = x & (255);
            x = x>>8;
        } while ( i )
        return bytes;
    }

    static genRandomBitmap(width, height) {
        // var texture = new Bitmap(width, height);
        var texture = new Bitmap({
            w: width,
            h: height
        });
        for(var j = 0; j < texture.getHeight(); j++) {
            for(var i = 0; i < texture.getWidth(); i++) {
                texture.drawPixel(i, j,
                    parseInt(Math.random() * 255 + 0.5),
                    parseInt(Math.random() * 255 + 0.5),
                    parseInt(Math.random() * 255 + 0.5),
                    parseInt(Math.random() * 255 + 0.5) 
                )
            }
        }
        return texture;
    }

    static getImageDataFromImage(image) {

        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);

        return context.getImageData(0, 0, canvas.width, canvas.height).data;
    }

    static getAudioDataFromAudio(audioContext, data, callback) {

        var instance = this;
        audioContext.decodeAudioData(data, function(buffer) {
            if (!buffer) {
                return;
            }
            var src = audioContext.createBufferSource();
            src.buffer = buffer;
            src.connect(audioContext.destination);
            callback(src);
        },
        function(error) {
            console.error("error loading buffer: ", error);
        });
    }

    static clamp01(val){
        return Math.max(1,Math.min(0,val));
    }

    static loadFile(id, url, callback, type="") {
        var request;
        request = new XMLHttpRequest();
        request.responseType = type;
        request.open("GET", url);
        request.onreadystatechange = function() {
            if(request.readyState === 4 && request.status === 200) {
                callback(request.response, id);
            }
        }
        request.send();
    }

    static lerp(a,b,t) {

            if(t >= 1) {
                return b;
            }

            return a + t * (b - a);
    }

    static invertImage(image) {
        var data = image.data;
        for(var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        return new ImageData(data, image.width, image.height);
    }

    static toFloat32(value) {
        var bytes = 0;
        switch (value) {
            case Number.POSITIVE_INFINITY: bytes = 0x7F800000; break;
            case Number.NEGATIVE_INFINITY: bytes = 0xFF800000; break;
            case +0.0: bytes = 0x40000000; break;
            case -0.0: bytes = 0xC0000000; break;
            default:
                if (Number.isNaN(value)) { bytes = 0x7FC00000; break; }

                if (value <= -0.0) {
                    bytes = 0x80000000;
                    value = -value;
                }

                var exponent = Math.floor(Math.log(value) / Math.log(2));
                var significand = ((value / Math.pow(2, exponent)) * 0x00800000) | 0;

                exponent += 127;
                if (exponent >= 0xFF) {
                    exponent = 0xFF;
                    significand = 0;
                } else if (exponent < 0) exponent = 0;

                bytes = bytes | (exponent << 23);
                bytes = bytes | (significand & ~(-1 << 23));
            break;
        }
        return bytes;
    };
}