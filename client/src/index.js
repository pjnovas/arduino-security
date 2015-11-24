
import app from './app';
window.app = app;

app.initialize(
  document.getElementById('controls'),
  document.getElementById('video-ctn')
);
