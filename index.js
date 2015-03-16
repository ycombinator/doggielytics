var tessel = require('tessel'),
    accel = require('accel-mma84').use(tessel.port['A']),
    wifi = require('wifi-cc3000'),
    Door = require('./lib/door.js');

var wiFiSsid = process.argv[2];
var wiFiPassword = process.argv[3];

wifi.connect({
  ssid: wiFiSsid,
  password: wiFiPassword
});

wifi.on('connect', function(res) {
  console.log("WiFi is connected. IP address = " + res.ip);
});

wifi.on('timeout', function() {
  console.log("WiFi conection timed out");
});

wifi.on('disconnect', function() {
  console.log("WiFi is disconnected :(");
});

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

door.on('visit-end', function(visit) {
  return console.log("Visit just ended: " + JSON.stringify(visit));
});
