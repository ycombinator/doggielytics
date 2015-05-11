var tessel = require('tessel'),
    accel = require('accel-mma84').use(tessel.port['A']),
    wifi = require('wifi-cc3000'),
    needle = require('needle'),
    Door = require('./lib/door.js'),
    logger = require('./lib/logger.js');

var wiFiSsid = process.argv[2];
var wiFiPassword = process.argv[3];
var esBaseUrl = process.argv[4];

wifi.on('connect', function(res) {
  logger.info("WiFi is connected. IP address = " + res.ip);
});

wifi.on('timeout', function() {
  logger.info("WiFi conection timed out. Retrying connection...");
  wifi.connect({
    ssid: wiFiSsid,
    password: wiFiPassword
  });
});

wifi.on('disconnect', function() {
  logger.info("WiFi is disconnected :( Retrying connection...");
  wifi.connect({
    ssid: wiFiSsid,
    password: wiFiPassword
  });
});

var door = new Door();

accel.on('ready', function () {
  logger.info('Accelerometer ready...');

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
    logger.info('Error:', err);
  });

  door.on('visit-end', function(visit) {
    logger.info("Visit just ended: " + JSON.stringify(visit));
    if (wifi.isConnected()) {
      needle.post(
        esBaseUrl + '/doggielytics/visit',
        visit,
        { json: true },
        function(err, resp) {
          if (err) {
            return logger.error(err);
          }
          logger.info("Indexed visit. ID = " + JSON.stringify(resp.body));
        }
      );
    } else {
      logger.warn('WiFi is not connected. Cannot index visit :(');
    }
  });

});
