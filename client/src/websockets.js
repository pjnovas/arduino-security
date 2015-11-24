
class IO {

  connect(){
    let baseURL = location.origin || location.protocol + "//" + location.host;
    this.socket = io.connect(baseURL);

    this.socket.on("connect", () => {
      console.log('CONNECTED!');
    });

    this.socket.on("disconnect", () => {
      console.log('DISCONNECTED!');
    });

    this.attachEvents();
  }

  attachEvents(){
    this.socket.on('state', state => window.app.setState(state));
    this.socket.on('frame', state => window.app.onFrame(state));
  }

  emit(event, data){
    this.socket.emit(event, data)
  }

}

const instance = new IO();
export default instance;
