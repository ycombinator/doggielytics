var tessel = require('tessel'),
    accel = require('accel-mma84').use(tessel.port['A']),
    Door = require('./lib/door.js');

var door = Door();

// Initialize the accelerometer.
accel.on('ready', function () {
  // Stream accelerometer data
  accel.on('data', function (xyz) {
    var x = xyz[0];
    if (x >= -0.9) {
      door.open();
    } else {
      door.close();
    }
  });
});

accel.on('error', function(err){
  console.log('Error:', err);
});
