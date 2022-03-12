import { ValidateNested } from 'class-validator';
import { SplitWiseConfig } from '../../src/splitwise/splitwise.config';

export function getMongoHost() {
  // Use variable set in docker-compose to know the mongodb host
  if (process.env.DOCKER_COMPOSE_SERVICES_MONGO_NAME !== undefined) {
    // Docker compose service name as host
    return process.env.DOCKER_COMPOSE_SERVICES_MONGO_NAME;
  }

  return '127.0.0.1';
}

class App {
  identifier = 'todo';
  logLevel = 'info';
  logConsole = true;
  logFile = '';
}

export class ServerConfig {
  port = 3000;
  basePath = '/api';
}

export class AuthConfig {
  audience = [];
  algorithms = ['RS256'];
  issuer = 'https://sso.acme.com/'; // End / is important
  jwksPath = '/protocol/openid-connect/certs';
  ignoreExpiration = false;
}

class Datasources {
  @ValidateNested()
  splitwise = new SplitWiseConfig();
}

export class AppConfig {
  @ValidateNested()
  app = new App();

  @ValidateNested()
  server = new ServerConfig();

  @ValidateNested()
  auth = new AuthConfig();

  @ValidateNested()
  datasources = new Datasources();
}
