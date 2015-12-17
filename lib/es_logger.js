var ElasticsearchIndexer = require('./es_indexer.js');

var ElasticsearchLogger = function(esBaseUrl) {

  var INDEX_NAME = "logs";
  var LOG_TYPE = "log";
  var _esLogIndexer = new ElasticsearchIndexer(esBaseUrl, INDEX_NAME, LOG_TYPE);

  var _log = function(message, level) {
    _esLogIndexer.index({ timestamp: new Date(), level: level, message: message });
  }

  this.info = function(message) {
    _log(message, "info");
  };

  this.error = function(message) {
    _log(message, "error");
  };

};

module.exports = ElasticsearchLogger;
