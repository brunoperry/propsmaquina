import Resources from "./src/core/Resources.js";
import TestScene from "./src/scenes/TestScene.js";

let scene;
let animID = null;
let tick = 0;

window.onload = async () => {
  await Resources.init();
  scene = new TestScene();

  document.querySelector("#play").onclick = () => {
    start();
  };

  document.querySelector("#pause").onclick = () => {
    pause();
  };

  document.querySelector("#stop").onclick = () => {
    stop();
  };
};

const loop = () => {
  if (!animID) return;

  tick++;
  scene.update(tick);
  animID = requestAnimationFrame(loop);
};

const start = () => {
  if (animID) return;
  animID = window.requestAnimationFrame(loop);
};
const pause = () => {
  if (!animID) return;
  window.cancelAnimationFrame(animID);
  animID = null;
};
const stop = () => {
  if (!animID) return;
  pause();
  tick = 0;
};
