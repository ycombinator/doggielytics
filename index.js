var tessel = require('tessel'),
    accel = require('accel-mma84').use(tessel.port['A']),
    wifi = require('wifi-cc3000'),
    needle = require('needle'),
    Door = require('./lib/door.js');

var wiFiSsid = process.argv[2];
var wiFiPassword = process.argv[3];
var esBaseUrl = process.argv[4];

wifi.on('connect', function(res) {
  console.log("WiFi is connected. IP address = " + res.ip);
});

wifi.on('timeout', function() {
  console.log("WiFi conection timed out. Retrying connection...");
  wifi.connect({
    ssid: wiFiSsid,
    password: wiFiPassword
  });
});

wifi.on('disconnect', function() {
  console.log("WiFi is disconnected :( Retrying connection...");
  wifi.connect({
    ssid: wiFiSsid,
    password: wiFiPassword
  });
});

var door = new Door();

accel.on('ready', function () {
  console.log('Accelerometer ready...');

  // // Attempt wifi connection after 10 seconds; for some bizzare
  // // reason this delay is required when the board is powered
  // // standalone (as opposed to being connected to a computer)
  // setTimeout(function() {
  //   wifi.connect({
  //     ssid: wiFiSsid,
  //     password: wiFiPassword
  //   });
  // }, 7 * 1000);

  accel.on('data', function (xyz) {
    var x = xyz[0];
    if (x >= -0.99) {
      door.open();
    } else {
      door.close();
    }
  });

  accel.on('error', function(err) {
    console.log('Error:', err);
  });

  door.on('visit-end', function(visit) {
    console.log("Visit just ended: " + JSON.stringify(visit));
    if (wifi.isConnected()) {
      needle.post(
        esBaseUrl + '/doggielytics/visits',
        visit,
        { json: true },
        function(err, resp) {
          if (err) {
            return winston.error(err);
          }
          console.log("Indexed visit. ID = " + JSON.stringify(resp.body));
        }
      );
    } else {
      console.warn('WiFi is not connected. Cannot index visit :(');
    }
  });

});
