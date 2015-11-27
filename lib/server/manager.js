
import arduino from "./arduino";
import camera from "./camera";
import email from "./email";

import { email as emailSettings } from 'config.json';

import { EventEmitter } from 'events';

class Manager extends EventEmitter {

  state = {
    arduino: false,
    camera: {
      working: false,
      on: false,
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

    let settings = emailSettings.alarm;

    this.screenshotsChunk = settings.screenshotsPerEmail;
    this.maxScreenshotsChunks = settings.maxEmailsPerAlarm;
    this.screenshotsDelay = settings.screenshotsDelay;

    this.alarmScreenshots = [];
    this.screenshotsStarted = null;
    this.currScreenshotsChunks = 0;
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

        this.alarmEmail(raw);

        if (this.state.camera.rec){
          // TODO: save raw image
        }

        this.emit('frame', raw);
      });

  }

  alarmEmail(raw){
    if (this.state.alarm.on && this.currScreenshotsChunks < this.maxScreenshotsChunks){

      if (Date.now() > this.screenshotsStarted + this.screenshotsDelay){
        this.alarmScreenshots.push(raw);

        if (this.alarmScreenshots.length >= this.screenshotsChunk){
          email.sendAlarm(this.alarmScreenshots.slice(0));
          this.alarmScreenshots = [];
          this.currScreenshotsChunks++;
        }

        this.screenshotsStarted = Date.now();
      }

    }
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
        switch(data){
          case 'left': arduino.moveMotorLeft(); break;
          case 'right': arduino.moveMotorRight(); break;
          case 'center': arduino.moveMotorCenter(); break;
          case 'sweep': arduino.toggleSweepMotor(); break;
        }
        break;
      case 'rec':
        this.state.camera.rec = data;
        this.changedState();
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
        this.state.alarm.on = false;
        this.camera('rec', false);
        break;
      case 'on':
        this.fireAlarm();
        break;
      case 'off':
        this.state.alarm.on = false;
        break;
    }

    this.changedState();
  }

  getState() {
    return Object.assign({}, this.state); // return a copy
  }

  fireAlarm(){ // Steps to do when the Alarm is Fired
    this.light(true); // Turn ligth ON

    this.camera('switch', true); // Start Camera if not started
    this.camera('rec', true); // Start Recording
    this.camera('move', 'center'); // Move Camera to center position

    this.alarmScreenshots = [];
    this.screenshotsStarted = Date.now();
    this.currScreenshotsChunks = 0;
    this.state.alarm.on = true;

    email.sendAlarm();

    this.changedState();
  }

};

const instance = new Manager();
export default instance;
