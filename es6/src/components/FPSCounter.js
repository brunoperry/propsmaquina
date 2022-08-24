export default class FPSCounter {
  #fps;
  #times = [];
  #callback;
  constructor(callback = null) {
    this.#callback = callback;
  }
  update() {
    const now = performance.now();
    while (this.#times.length > 0 && this.#times[0] <= now - 1000) {
      this.#times.shift();
    }
    this.#times.push(now);
    this.#fps = this.#times.length;

    if (this.#callback) this.#callback(this.#fps);
  }
}
