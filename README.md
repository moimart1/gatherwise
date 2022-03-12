# GatherWise

> Easiest spending into SplitWise

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

## Install NestJS CLI

Useful to add controllers, modules, middlewares, ... in application

```sh
npm install -g @nestjs/cli
nest --help
```


## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run build`: Transform Typscript code to javascript in `dist/`
- `npm run config:create`: Create application config in HOME directory to hide secrets
- `npm run docker:build`: Build a Docker image for this application with docker compose
- `npm run docker:dev`: Run this application inside a Docker container with docker compose
- `npm run docker:test`: Test this application inside a Docker container with docker compose
- `npm run start:dev`: Run application on watch mode, auto reload on files change
- `npm run start:debug`: Run application in debug mode (like `start:dev` but with debug port). Note can use "Attach" debugger mode
- `npm run audit:ci`: Run npm audit for CI (export result to JSON file)

## Tests

```sh
npm test
```

## Environment variables

### NODE_ENV

NodeJS environments:

- `development`: Local development
- `test`: When run test with Jest
- `production-beta`: When run on production on beta stage
- `production`: When run on production

### APP_CONFIG_PATH

Override default config with external config. Expect JSON file path. Useful to hide secrets.

### APP_JWT_IGNORE_EXPIRATION (dev only)

If set to `true` with environment `development` or `testing` the JWT validation ignore the token expiration.
Useful to avoid to regenerate a token each time when develop or test

## What's next

Please check out [Nest JS documentation](https://docs.nestjs.com/) to
understand how you can continue to add features to this application.
