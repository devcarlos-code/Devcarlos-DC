const welcome = document.querySelector("#welcome");
const playerPanel = document.querySelector("#player-panel");
const playButton = document.querySelector("#play-video");
const video = document.querySelector("#video");
const status = document.querySelector("#playback-status");
const playbackLabel = document.querySelector("#playback-label");

playButton.addEventListener("click", async () => {
  welcome.hidden = true;
  playerPanel.hidden = false;
  playbackLabel.textContent = "Cargando video";
  status.textContent = "";
  status.removeAttribute("data-error");

  video.muted = false;
  video.volume = 1;

  try {
    await video.play();
  } catch (error) {
    status.textContent =
      "No se pudo iniciar el video. Comprueba tu conexión y vuelve a intentarlo con los controles.";
    status.dataset.error = "true";
    playbackLabel.textContent = "Error de reproducción";
    console.error("No se pudo reproducir el video:", error);
  }
});

video.addEventListener("error", () => {
  status.textContent =
    "No se pudo cargar este archivo de video. Recarga la página o inténtalo de nuevo más tarde.";
  status.dataset.error = "true";
  playbackLabel.textContent = "Error de reproducción";
});

video.addEventListener("playing", () => {
  status.textContent = "";
  status.removeAttribute("data-error");
  playbackLabel.textContent = "Reproduciendo";
});

video.addEventListener("pause", () => {
  if (!video.ended && !video.error) playbackLabel.textContent = "En pausa";
});
