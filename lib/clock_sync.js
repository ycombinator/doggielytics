var wifi = require('wifi-cc3000'),
    needle = require('needle');

var ClockSync = function(logger) {

  var SYNC_FREQUENCY_MINUTES = 3;

  setInterval(function() {
    if (wifi.isConnected()) {
      needle.get('http://www.timeapi.org/utc/now', function(err, resp) {
        if(err) {
          return logger.error('Error getting time: ' + err);
        }

        logger.info('Onboard clock time before sync: ' + (new Date()));

        var datetime = new Date(resp.body);
        logger.info('Setting onboard clock time to ' + datetime);
        process.binding('tm').timestamp_update(datetime.getTime() * 1000);

        logger.info('Onboard clock time after sync: ' + (new Date()));

      });
    }
  }, SYNC_FREQUENCY_MINUTES * 60 * 1000);
}

module.exports = ClockSync;
