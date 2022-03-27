# Gatherwise

> Easiest spending into SplitWise

## Quick start

Start the server

```sh
npm install
npm run docker:dev -- mongo
npm start
```

### Test with cUrl

```sh
curl --form "file=@tmp/sources/spent.csv" http://localhost:3000/api/import
```

### Test with Swagger Explorer

Go to http://localhost:3000/api/explorer/#/default/ImportController_uploadFile
