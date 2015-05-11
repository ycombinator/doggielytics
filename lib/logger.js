var ElasticsearchLogger = require('./es_logger.js');

var Logger = function(options) {
  var _esLogger = new ElasticsearchLogger(options.esBaseUrl);

  this.info = function(message) {
    console.info(message);
    _esLogger.info(message);
  };

  this.error = function(message) {
    console.error(message);
    _esLogger.error(message);
  };

};

module.exports = Logger;
