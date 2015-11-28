
import socket from 'socket.io';
import manager from './manager';

let io;

const events = {
  "cam:start": () => manager.camera('switch', true),
  "cam:stop": () => manager.camera('switch', false),
  "cam:move": data => manager.camera('move', data),

  "cam:rec:start": () => manager.camera('rec', true),
  "cam:rec:stop": () => manager.camera('rec', false),

  "light:on": () => manager.light(true),
  "light:off": () => manager.light(false),

  "alarm:enable": () => manager.alarm('enable'),
  "alarm:disable": () => manager.alarm('disable'),
  "alarm:on": () => manager.alarm('on'),
  "alarm:off": () => manager.alarm('off')
};

const emitters = [
  "state",
  "frame"
];

const emit = (event, data) => {
  if (io && emitters.indexOf(event) > -1){
    io.emit(event, data);
  }
};

const onConnection = socket => {
  console.log('New Connection %s', socket.id);

  Object.keys(events).forEach(key => {
    socket.on(key, events[key]);
  });

  socket.emit("state", manager.getState());
};

manager
  .on('state:change', () => {
    emit("state", manager.getState());
  })
  .on('frame', raw => {
    emit("frame", raw);
  });

export const connect = server => {
  io = socket(server);
  io.on('connection', onConnection);
};
