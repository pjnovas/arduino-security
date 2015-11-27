import $ from 'jquery';

import ws from './websockets';
import Capture from './capture';
import viewport from './viewport.hbs';

export default {

  initialize(controls, video){
    this.container = controls;
    this.state = {};

    this.container.innerHTML = viewport();
    this.capture = new Capture(video);

    ws.connect();
    this.bindEvents();
  },

  bindEvents() {
    $(this.container)
      .on('click', '#camera-on', () => this.onActionCamera())
      .on('click', '#rec', () => this.onActionCameraRec())
      .on('click', '#light-on', () => this.onActionLight())
      .on('click', '#alarm-enabled', () => this.onActionAlarm())
      .on('click', '#move-left', () => this.onActionMotor('left'))
      .on('click', '#move-right', () => this.onActionMotor('right'))
      .on('click', '#move-sweep', () => this.onActionMotor('sweep'));
  },

  setState(state){
    this.state = state;

    console.dir(this.state);
    this.container.innerHTML = viewport(this.state);

    if (this.state.camera.on === false){
      this.capture.clear();
    }
  },

  onFrame(raw){
    if (this.state.camera && this.state.camera.on){
      this.capture.frame(raw);
    }
  },

  onActionAlarm(){
    if ($('#alarm-enabled').prop('checked')){
      this.fireAction('alarm:enable');
    }
    else {
      this.fireAction('alarm:disable');
    }
  },

  onActionCamera(){
    this.state.camera.working = true;

    if ($('#camera-on').prop('checked')){
      this.fireAction('cam:start');
    }
    else {
      this.fireAction('cam:stop');
    }

    this.setState(this.state);
  },

  onActionCameraRec(){
    if (this.state.camera.rec) {
      this.fireAction('cam:rec:start');
    }
    else {
      this.fireAction('cam:rec:stop');
    }
  },

  onActionLight() {
    if ($('#light-on').prop('checked')){
      this.fireAction('light:on');
    }
    else {
      this.fireAction('light:off');
    }
  },

  onActionMotor(type) {
    switch(type){
      case 'left':
        this.fireAction('cam:move', 'left');
        break;
      case 'right':
        this.fireAction('cam:move', 'right');
        break;
      case 'sweep':
        this.fireAction('cam:move', 'sweep');
        break;
    }
  },

  fireAction(action, data){
    console.log('Fire Action: ' + action);
    ws.emit(action, data);
  }

};
