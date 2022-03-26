# GatherWise

> Easiest spending into SplitWise

## Quick start

Start the server

```sh
npm install
npm start
```

### Test with cUrl

```sh
curl --form "file=@tmp/sources/spent.csv" http://localhost:3000/api/sources/upload
```

### Test with Swagger Explorer

Go to http://localhost:3000/api/explorer/#/default/SourcesController_uploadFile
