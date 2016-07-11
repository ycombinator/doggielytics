# Doggielytics

Visualizing my dogs visits to the backyard using a [Tessel 2](http://tessel.io/), [Elasticsearch](https://www.elastic.co/downloads/elasticsearch), and [Kibana](https://www.elastic.co/downloads/kibana).

## Configuration

1. Create a directory named `config` in the same directory as this README file.

2. In the `config` directory, create a file named `index.js` and populate it with this code, filling in the appropriate values:

```
module.exports = {
  elasticsearch: {
    connection: {
      protocol: '',
      host: '',
      port: ,
      username: '', // Remove if using an insecure Elasticsearch cluster
      password: '' // Remove if using an insecure Elasticsearch cluster
    },
    indices: {
      logs: { index: 'doggielytics-logs', type: 'log' },
      visits: { index: 'doggielytics-visits', type: 'visit' }
    }
  }
};
```

## Deployment

1. Connect Tessel via USB

2. Deploy code + packages

```
t2 push index.js --full
```

## Kibana

You can visualize your dog's visits in Kibana. Once you have Kibana 4 running, you can get started quickly by importing the contents of the [`kibana/k4_objects.json`](/kibana/k4_objects.json) file into Kibana. This will give you a dashboard that looks like this:

![Main dashboard screenshot](/kibana/k4_dashboard_screenshot.png)
