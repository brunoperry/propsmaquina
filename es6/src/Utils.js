import Bitmap from "./rendering/Bitmap.js";

export default class Utils {
  static toRadians(angle) {
    return (angle / 180) * Math.PI;
  }

  static getInt64Bytes(x) {
    let bytes = [];
    let i = 8;
    do {
      bytes[--i] = x & 255;
      x = x >> 8;
    } while (i);
    return bytes;
  }

  static genRandomBitmap(width, height) {
    const texture = new Bitmap({
      width: width,
      height: height,
    });
    for (let j = 0; j < texture.height; j++) {
      for (let i = 0; i < texture.width; i++) {
        texture.drawPixel(
          i,
          j,
          parseInt(Math.random() * 255 + 0.5),
          parseInt(Math.random() * 255 + 0.5),
          parseInt(Math.random() * 255 + 0.5),
          parseInt(Math.random() * 255 + 0.5)
        );
      }
    }
    return texture;
  }

  static async getImageDataFromBlob(blob) {
    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        resolve({
          width: img.width,
          height: img.height,
          imageData: context.getImageData(0, 0, canvas.width, canvas.height)
            .data,
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  static getAudioDataFromAudio(audioContext, data, callback) {
    audioContext.decodeAudioData(
      data,
      (buffer) => {
        if (!buffer) return;
        let src = audioContext.createBufferSource();
        src.buffer = buffer;
        src.connect(audioContext.destination);
        callback(src);
      },
      (error) => {
        console.error("error loading buffer: ", error);
      }
    );
  }

  static clamp01(val) {
    return Math.max(1, Math.min(0, val));
  }

  static async loadFile(id, url, callback, type = "") {
    // const req = await fetch(url);
    // const res =
    //   // let request = new XMLHttpRequest();
    //   (request.responseType = type);
    // request.open("GET", url);
    // request.onreadystatechange = function () {
    //   if (request.readyState === 4 && request.status === 200) {
    //     callback(request.response, id);
    //   }
    // };
    // request.send();
  }

  static lerp(a, b, t) {
    if (t >= 1) return b;
    return a + t * (b - a);
  }

  static invertImage(image) {
    let data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    return new ImageData(data, image.width, image.height);
  }
  static removeEmptyStrings(data) {
    let dataOut = [];
    for (let i = 0; i < data.length; i++)
      if (data[i] !== "") dataOut.push(data[i]);

    return dataOut;
  }
}
