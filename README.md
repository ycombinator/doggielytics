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
      username: '',
      password: ''
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
