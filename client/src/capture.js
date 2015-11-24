
const size = {
  width: 640,
  height: 480
};

export default class Capture {

  constructor(ctn){
    this.container = ctn;
    this.createCanvas();
  }

  createCanvas(){
    var canvas = document.createElement('canvas');

    canvas.width = size.width;
    canvas.height = size.height;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.container.appendChild(this.canvas);
  }

  clear(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  frame(raw){
    let w = this.canvas.width;
    let h = this.canvas.height;
    let context = this.context;

    let img = new Image();

    img.onload = function() {
      context.clearRect(0, 0, w, h);
      context.drawImage(this, 0, 0, w, h);
    }

    img.src = "data:image/png;base64," + raw;
  }

}
