var tessel = require('tessel'),
    wifi = require('wifi-cc3000'),
    needle = require('needle');

var wiFiSsid = process.argv[2];
var wiFiPassword = process.argv[3];
var requestBinUrl = process.argv[4];

var leds = {
  green: tessel.led[0],
  blue:  tessel.led[1]
};

var blink = function(led, numberOfTimes) {
  var intervalId;
  numberOfTimes = numberOfTimes * 2;
  intervalId = setInterval(function() {
    led.toggle();
    --numberOfTimes;
    if (numberOfTimes === 0) {
      clearInterval(intervalId);
    }
  }, 200);
};

blink(leds.blue, 5);

setTimeout(function() {
  wifi.connect({
    ssid: wiFiSsid,
    password: wiFiPassword
  });
}, 7 * 1000);

var numRequestsAttempted = 0;
setInterval(function() {
    ++numRequestsAttempted;
    console.log("Attempting to send heartbeat message #" + numRequestsAttempted + "...");
    if (wifi.isConnected()) {
      needle.post(
        requestBinUrl,
        {
            message: "WiFi is still connected!",
            numRequestsAttempted: numRequestsAttempted
                },
        function(err, response) {
          if (err) {
            console.log("Error: " + err);
          } else {
            console.log("Response: " + response.body);
          }
        }
      );
    } else {
      console.log("WiFi is not connected right now. Cannot send heartbeat message :(");
    }
}, 20 * 1000);
  

var numWiFiConnects = 0;
wifi.on('connect', function(res) {
  ++numWiFiConnects;
  blink(leds.green, 3);
  console.log("WiFi is connected. IP address = " + res.ip);
  needle.post(
    requestBinUrl,
    {
        message: "WiFi just (re)connected",
        numWiFiConnects: numWiFiConnects
    },
    function(err, response) {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Response: " + response.body);
      }
    }
  );
});

wifi.on('disconnect', function() {
  console.log("WiFi is disconnected :( Retrying...");
  wifi.connect({
    ssid: wiFiSsid,
    password: wiFiPassword
  });
});

wifi.on('timeout', function() {
  console.log("WiFi has timed out :( Retrying...");
  wifi.connect({
    ssid: wiFiSsid,
    password: wiFiPassword
  });
});
