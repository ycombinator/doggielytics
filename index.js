var tessel = require('tessel'),
    accel = require('accel-mma84').use(tessel.port['A']),
    wifi = require('wifi-cc3000'),
    request = require('request'),
    Door = require('./lib/door.js');

var wiFiSsid = process.argv[2];
var wiFiPassword = process.argv[3];
var esBaseUrl = process.argv[4];

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
  console.log("Visit just ended: " + JSON.stringify(visit));
  if (wifi.isConnected()) {
    request({
      url: esBaseUrl + '/doggielytics/visits',
      method: 'POST',
      body: visit,
      json: true
    }, function(err, resp, body) {
      if (err) {
        return console.error(err);
      }
      console.log("Indexed visit. ID = " + body._id);
    });
  } else {
    console.warn('WiFi is not connected.');
  }
});
