var wifi = require('wifi-cc3000'),
    needle = require('needle');

var esBaseUrl = process.argv[4];

var logToElasticSearch = function(message, level) {
  // If WiFi is connected, log to Elasticsearch
  if (wifi.isConnected()) {
    needle.post(
      esBaseUrl + '/doggielytics/log',
      { timestamp: new Date(), level: level, message: message },
      { json: true },
      function(err, resp) {
        if (err) {
          return console.error(err);
        }
        console.info("Indexed log. ID = " + JSON.stringify(resp.body));
      }
    );
  } else {
    console.warn('WiFi is not connected. Cannot index log :(');
  }
}

module.exports = {
  info: function(message) {
    console.info(message);
    logToElasticSearch(message, "info");
  },

  error: function(message) {
    // Log to console
    console.error(message);
    logToElasticSearch(message, "error");
  }
}
