var tessel = require('tessel'),
    accel = require('accel-mma84').use(tessel.port['A']),
    Door = require('./lib/door.js');

var door = new Door();

accel.on('ready', function () {
  accel.on('data', function (xyz) {
    var x = xyz[0];
    if (x >= -0.9) {
      door.open();
    } else {
      door.close();
    }
  });
});

accel.on('error', function(err) {
  console.log('Error:', err);
});

door.on('visit-start', function() {
  console.log('Visit started');
});

door.on('visit-end', function(visit) {
  var visitSeconds = (visit._endTime.getTime() - visit._startTime.getTime()) / 1000;
  console.log('Visit ended; duration = ' + visitSeconds + ' seconds.');
});
