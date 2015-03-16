var events = require('events');

var Door = function() {

  var _isDoorOpen = false;
  var _isDogVisiting = false;
  var _swingingTimeoutId = null;
  var _currentVisit = null;
  var _visits = [];

  events.EventEmitter.call(this);

  this.open = function() {
    if (_isDoorOpen) {
      return;
    }
    _isDoorOpen = true;
    clearTimeout(_swingingTimeoutId);
  };

  this.close = function() {
    var self = this;
    if (!_isDoorOpen) {
      return;
    }
    _isDoorOpen = false;
    _swingingTimeoutId = setTimeout(function() {
      if (!_isDogVisiting) {
        // Dog just went out; start visit
        _isDogVisiting = true;
        _currentVisit = {
          startTime: new Date()
        };

        self.emit('visit-start');

      } else {
        // Dog just returned; end visit
        _isDogVisiting = false;
        _currentVisit.endTime = new Date();
        _currentVisit.durationSeconds = (_currentVisit.endTime.getTime()
                                         - _currentVisit.startTime.getTime()) / 1000;

        self.emit('visit-end', _currentVisit);

        _visits.push(_currentVisit);
        _currentVisit = null;
      }
      _swingingTimeoutId = null;
    }, 1500);
  };

};

Door.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Door;
