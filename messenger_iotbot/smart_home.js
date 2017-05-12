// 3rd party libraries
const five = require('johnny-five');

// the boards that are connected to our computer
const ports = [
  { id: 'front_door', port: process.env.J5_FRONT_DOOR_PORT }
];
let fd_relay = undefined;
const boards = new five.Boards(ports).on("ready", function() {
  // step: create the relay. We are using the front-door board for this
  fd_relay = new five.Relay({
    pin: 5,
    type: 'NO',
    board: this[0]
  });
  console.log('boards ready');
});

// methods to be exported

// controlling the front door. Basically it just open the door by enabling it.
const fd_open = function(callback) {
  try {
    // step: turn on the relay
    fd_relay.on();
    // step: wait for a bit and turn it off
    setTimeout(function(){ fd_relay.off(); }, 1000);
    // step: call the callback
    callback();
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  fd_open
};
