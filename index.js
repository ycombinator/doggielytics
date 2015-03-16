var tessel = require('tessel'),
    accel = require('accel-mma84').use(tessel.port['A']);

var app =  {
  isDoorOpen: false,
  isDoorSwinging: false,
  isDogVisiting: false,
  visits: [],

  swingingTimeoutId: null,
  currentVisit: null
}


// Initialize the accelerometer.
accel.on('ready', function () {
    // Stream accelerometer data
  accel.on('data', function (xyz) {
    var x = xyz[0];
    if (x >= -0.9) {
      if (!app.isDoorOpen) {
        app.isDoorOpen = true;
        clearTimeout(app.swingingTimeoutId);
      }
    } else {
      if (app.isDoorOpen) {
        app.isDoorOpen = false;
        app.swingingTimeoutId = setTimeout(function() {
          if (!app.isDogVisiting) {
            // Dog just went out; start visit
            app.isDogVisiting = true;
            app.currentVisit = {
              startTime: new Date()
            };
            
            console.log("Dog went out for visit");
            
          } else {
            // Dog just returned; end visit
            app.isDogVisiting = false;
            app.currentVisit.endTime = new Date();
            
            var visitSeconds = (app.currentVisit.endTime.getTime() - app.currentVisit.startTime.getTime()) / 1000;
            console.log("Dog returned from visit; visit lasted " + visitSeconds + " seconds");
            
            app.visits.push(app.currentVisit);
            app.currentVisit = null;
          }
          app.swingingTimeoutId = null;
        }, 1500);
      }
    }
  });
});

accel.on('error', function(err){
  console.log('Error:', err);
});
