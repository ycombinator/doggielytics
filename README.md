Uses Tessel with the Accelerometer module to track my dog's visits to the backyard.

## Deployment

### Software

#### Step 0. Install pre-requisites
```
$ yarn global add t2-cli
```

#### Step 1. Install dependencies
```
$ yarn install
```

#### Step 2. Push software to Tessel
```
$ t2 push index.js \
    --args <WiFi SSID> \
    --args <WiFi Password> \
    --args <Elasticsearch node HTTP address>
```

##### Example:

```
$ t2 push index.js \
    --args mywifi \
    --args Sup3rSecr3t \
    --args http://192.168.2.11:9200
```

### Hardware

1. Attach the accelerometer module in port A of the Tessel.

2. Attach the tessel to the doggie door such that port A is to the top and right and the USB port is on the right edge of the Tessel.

3. Power the Tessel.
