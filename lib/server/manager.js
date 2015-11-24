
import arduino from "./arduino";
import camera from "./camera";

import { EventEmitter } from 'events';

class Manager extends EventEmitter {

  state = {
    arduino: false,
    camera: {
      working: false,
      on: false,
      pos: 0,
      rec: false
    },
    light: false,
    alarm: {
      enabled: false,
      on: false
    },
    motion: false
  }

  constructor(){
    super();
    this.attachEvents();
  }

  changedState(){
    this.emit('state:change');
  }

  attachEvents() {

    arduino
      .on('online', () => {
        this.state.arduino = true;
        this.changedState();
      })
      .on('light', state => {
        this.state.light = state;
        this.changedState();
      })
      .on('motor', state => {
        this.state.camera.pos = state.position;
        this.changedState();
      })
      .on('motion', state => {
        this.state.motion = state;

        if (this.state.alarm.enabled && !this.state.alarm.on){
          this.fireAlarm(); // Fire ALARM!
        }

        this.changedState();
      });

    camera
      .on('start', () => {
        this.state.camera.working = false;
        this.state.camera.on = true;
        this.changedState();
      })
      .on('stop', () => {
        this.state.camera.working = false;
        this.state.camera.on = false;
        this.changedState();
      })
      .on('error', err => {
        console.log('CAMERA ERROR >>> ');
        console.dir(err);
      })
      .on('frame', raw => {
        if (this.state.camera.rec){
          // TODO: save raw image
        }
        this.emit('frame', raw);
      })
      .on('frames', raw => {
        if (this.state.camera.rec){
          // TODO: save raw image
        }
        this.emit('frames', raw);
      });

  }

  camera(event, data) {

    switch(event){
      case 'switch':
        this.state.camera.working = true;
        this.changedState();

        if (data) camera.start();
        else camera.stop();

        break;
      case 'move':
        //arduino.moveMotor(data);
        break;
      case 'rec':
        this.state.camera.rec = data;
        break;
    }
  }

  light(on) {
    if (this.state.light !== on){
      arduino.light(on);
    }
  }

  alarm(event) {
    switch(event){
      case 'enable':
        this.state.alarm.enabled = true;
        break;
      case 'disable':
        this.state.alarm.enabled = false;
        break;
      case 'on':
        this.fireAlarm();
        break;
      case 'off':
        this.state.alarm.on = false;
        break;
    }
  }

  getState() {
    return Object.assign({}, this.state); // return a copy
  }

  fireAlarm(){ // Steps to do when the Alarm is Fired
    this.light(true); // Turn ligth ON

    this.camera('switch', true); // Start Camera if not started
    this.camera('rec', true); // Start Recording
    this.camera('move', 0); // Move Camera to center position

    this.alarm('on'); // Fire Alarm

    // TODO: Send Email!
  }

};

const instance = new Manager();
export default instance;
