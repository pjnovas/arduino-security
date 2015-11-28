
import cv from 'opencv';
import { EventEmitter } from 'events';

import { camera as settings } from 'config.json';

class Camera extends EventEmitter {

  constructor(){
    super();

    this.settings = settings;

    this.timer = null;
    this.open = false;
    this.camera = null;
  }

  config(_settings) {
    Object.keys(_settings).forEach( p => {
      if (!this.settings.hasOwnProperty(p)){
        throw new Error('Unexpected setting ' + p);
      }

      this.settings[p] = _settings[p];
    });
  }

  start(){
    this.open = true;

    if (!this.camera){
      this.camera = new cv.VideoCapture(this.settings.camIndex);
    }

    this.camera.setWidth(this.settings.width);
    this.camera.setHeight(this.settings.height);

    var frame = () => {

      let matrix = this.camera.ReadSync();

      if (matrix.size()[0] > 0 && matrix.size()[1] > 0) {
        let raw = matrix.toBuffer({
          ext: this.settings.ext,
          jpegQuality: this.settings.quality
        }).toString("base64");

        this.emit('frame', raw);
      }

      matrix.release(); // clear memory

      clearTimeout(this.timer);

      if (this.open){
        this.timer = setTimeout(frame,10);
      }
    };

    frame();
    this.emit('start');
  }

  stop(){
    this.open = false;
    clearTimeout(this.timer);

    this.camera.close();
    this.camera = null;

    this.emit('stop');
  }

  onError(err){
    this.emit('error', err);
  }
}

const instance = new Camera();
export default instance;
