document.getElementById('btnEntrar').addEventListener('click', () => {
  // Oculta la pantalla de inicio
  document.getElementById('inicio').style.display = 'none';
  
  // Muestra el contenedor del video
  document.getElementById('videoContainer').style.display = 'block';

  // Reproduce el audio al hacer click (esto evita el bloqueo de Chrome)
  const audio = document.getElementById('miAudio');
  audio.play();
});