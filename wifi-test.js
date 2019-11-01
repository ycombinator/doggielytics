var tessel = require('tessel'),
    needle = require('needle');

var wiFiSsid = process.argv[2];
var wiFiPassword = process.argv[3];
var requestBinUrl = process.argv[4];

console.log({ args: process.argv, wiFiSsid, wiFiPassword, requestBinUrl })

const connectionSettings = {
  ssid: wiFiSsid,
  password: wiFiPassword,
  security: 'wpa2'
}

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

// Blink the blue LED 5 times
blink(leds.blue, 5);

// Try to connect to WiFi after 7 seconds
setTimeout(function() {
  tessel.network.wifi.connect(connectionSettings);
}, 7 * 1000);

var numRequestsAttempted = 0;
setInterval(function() {
    ++numRequestsAttempted;
    console.log("Attempting to send heartbeat message #" + numRequestsAttempted + "...");
    tessel.network.wifi.connection((err, settings) => {
      console.log(err)
      console.log(settings)
      if (false) {
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
    })
}, 20 * 1000);
  

var numWiFiConnects = 0;
tessel.network.wifi.on('connect', function(res) {
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

tessel.network.wifi.on('disconnect', function() {
  console.log("WiFi is disconnected :( Retrying to connect...");
  tessel.network.wifi.connect(connectionSettings);
});
