var wifi = require('wifi-cc3000'),
    needle = require('needle');

var ElasticsearchIndexer = function(esBaseUrl, index, type) {

  var _queue = [];

  // Process queue and send queued items to Elasticsearch
  setInterval(function() {
    // If WiFi is connected, index item to Elasticsearch
    if (wifi.isConnected()) {
      while (_queue.length > 0) {
        var document = _queue.shift();
        needle.post(
          esBaseUrl + '/' + index + '/' + type,
          document,
          { json: true },
          function(err, resp) {
            if (err) {
              return console.error(err);
            }
            console.info("Indexed document. ID = " + JSON.stringify(resp.body));
          }
        );

      }
    }

  }, 5000);

  this.index = function(document) {
    _queue.push(document);
  };
};

module.exports = ElasticsearchIndexer;
