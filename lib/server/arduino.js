
import five, { Board } from "johnny-five";
import { EventEmitter } from 'events';

const pins = {
  sensor: 7,
  motor: [10, 11, 12, 13],
  relay: 8
};

class Arduino extends EventEmitter {

  state = {

  }

  constructor(){
    super();

    this.board = new Board();
    this.board.on("ready", () => this.onReady());
  }

  onReady() {
    console.log('Arduino READY!');

    this.createLight();
    this.createMotor();
    this.createSensor();

    this.emit('online');
  }

  createLight() {
    this.relay = new five.Relay({
      type: "NC", // Normally Closed
      pin: pins.relay
    });
  }

  createMotor(){
    this.motor = new five.Stepper({
      type: five.Stepper.TYPE.FOUR_WIRE,
      stepsPerRev: 64,
      pins: pins.motor,
      direction: five.Stepper.DIRECTION.CW
    });
  }

  createSensor() {
    this.sensor = new five.IR.Motion(pins.sensor);

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
    if (on) this.relay.on();
    else this.relay.off();

    this.emit('light', on);
  }

  moveMotor(data){
    this.motor.direction(data).step(100, () => {
      this.emit('motor', 0);
    });
  }

};

const instance = new Arduino();
export default instance;
