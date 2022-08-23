import Utils from "../Utils.js";

export default class ImageLoader {
  static async load({ url, name = "unamed" }) {
    const req = await fetch(url);
    const res = await req.blob();

    return Utils.getImageDataFromBlob(res);

    // return new Promise(
    //   (resolve) => {
    //     const image = new Image();
    //     image.onload = () => Utils.getImageDataFromBlob(res);
    //     return;
    //   },
    //   (reject) => {}
    // );
    // image.onload = () => Utils.getImageDataFromBlob(image);
    // image.src = URL.createObjectURL(textureData.imageData);
    // return {
    //   imageData: Utils.getImageDataFromBlob(image),
    //   name: name,
    // };
  }
}
