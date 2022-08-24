import FPSCounter from "./src/components/FPSCounter.js";
import GizmoEngine from "./src/core/GizmoEngine.js";
import TestScene from "./src/scenes/TestScene.js";

//UI
let playPauseButton;
let fpsLabel;

window.onload = async () => {
  //GIZMO3D
  await GizmoEngine.init();
  GizmoEngine.addScene(new TestScene());
  GizmoEngine.addComponent({
    component: new FPSCounter((fps) => {
      fpsLabel.innerText = `FPS: ${fps}`;
    }),
  });

  //UI
  playPauseButton = document.querySelector("#playpause");
  fpsLabel = document.querySelector("#fps");

  playPauseButton.onclick = () => {
    GizmoEngine.isRunning ? pause() : start();
  };

  document.querySelector("#stop").onclick = () => {
    stop();
  };
};

const start = () => {
  playPauseButton.innerText = "pause";
  playPauseButton.className = "active";
  GizmoEngine.start();
};
const pause = () => {
  playPauseButton.innerText = "play";
  playPauseButton.className = "";
  GizmoEngine.pause();
};
const stop = () => {
  pause();
  GizmoEngine.stop();
};
