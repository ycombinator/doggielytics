module.exports = function() {
  var _isDoorOpen = false;
  var _isDogVisiting = false;

  var _swingingTimeoutId = null;
  var _currentVisit = null;

  var _visits = [];

  return {

    open: function() {
      if (_isDoorOpen) {
        return;
      }
      _isDoorOpen = true;
      clearTimeout(_swingingTimeoutId);
    },

    close: function() {
      if (!_isDoorOpen) {
        return;
      }
      _isDoorOpen = false;
      _swingingTimeoutId = setTimeout(function() {
        if (!_isDogVisiting) {
          // Dog just went out; start visit
          _isDogVisiting = true;
          _currentVisit = {
            _startTime: new Date()
          };
            
          console.log("Dog went out for visit");
            
        } else {
          // Dog just returned; end visit
          _isDogVisiting = false;
          _currentVisit._endTime = new Date();
            
          var visitSeconds = (_currentVisit._endTime.getTime() - _currentVisit._startTime.getTime()) / 1000;
          console.log("Dog returned from visit; visit lasted " + visitSeconds + " seconds");
          
          _visits.push(_currentVisit);
          _currentVisit = null;
        }
        _swingingTimeoutId = null;
      }, 1500);
    }
  };
  
};

