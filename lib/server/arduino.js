
import five, { Board } from "johnny-five";
import { EventEmitter } from 'events';

import { arduino as settings } from 'config.json';

class Arduino extends EventEmitter {

  state = {
    motorSweeping: false,
    motorAngle: settings.motor.startAt
  }

  constructor(){
    super();

    this.sweepTimer = null;

    this.board = new Board();
    this.board.on("ready", () => this.onReady());
  }

  onReady() {
    console.log('Arduino READY!');

    this.relay = new five.Relay(settings.relay);
    this.motor = new five.Servo(settings.motor);

    this.createSensor();

    this.emit('online');
  }

  createSensor() {
    this.sensor = new five.Motion(settings.sensor.pin);

    this.sensor.on("calibrated", () => {
      // "calibrated" occurs once, at the beginning of a session,
     console.log("calibrated", Date.now());
    });

    this.sensor.on("motionstart", () => {
     console.log("motionstart", Date.now());
     this.emit('motion', true);
    });

    this.sensor.on("motionend", () => {
     console.log("motionend", Date.now());
     this.emit('motion', false);
    });
  }

  light(on){
    if (on) this.relay.off();
    else this.relay.on();

    this.emit('light', on);
  }

  moveMotorLeft(){
    this.moveMotor(this.state.motorAngle + 1);
  }

  moveMotorRight(){
    this.moveMotor(this.state.motorAngle - 1);
  }

  moveMotorCenter(){
    this.moveMotor(settings.motor.startAt);
  }

  moveMotor(angle){
    this.stopSweepMotor();

    if (angle < settings.motor.range[0] || angle > settings.motor.range[1]){
      return;
    }

    this.motor.to(angle);
    this.state.motorAngle = angle;
  }

  stopSweepMotor(){
    this.motor.stop();
    this.state.motorSweeping = false;
    clearInterval(this.sweepTimer);
  }

  toggleSweepMotor() {
    if (this.state.motorSweeping){
      this.stopSweepMotor();
      return;
    }

    this.startSweepMotor();
  }

  startSweepMotor() {
    if (this.state.motorSweeping){
      return;
    }

    this.state.motorSweeping = true;

    let dir = 1;
    clearInterval(this.sweepTimer);

    this.sweepTimer = setInterval(() => {
      let angle = this.state.motorAngle + (0.1*dir);

      if (angle < settings.motor.range[0]) {
        dir = 1;
        angle = settings.motor.range[0];
      }

      if (angle > settings.motor.range[1]){
        dir = -1;
        angle = settings.motor.range[1];
      }

      this.motor.to(angle);
      this.state.motorAngle = angle;
    }, 10);
  }

};

const instance = new Arduino();
export default instance;
