import { Logger, MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig, ConfigModule, ServerConfig } from '../utils/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { ImportModule } from './endpoints/import/import.module';
import { SecretModule } from './endpoints/secret/secret.module';
import { SourcesModule } from './endpoints/sources/sources.module';
import { SplitwiseModule } from './splitwise/splitwise.module';

const DatabaseModule = MongooseModule.forRootAsync({
  useFactory: async (config: AppConfig) => {
    return {
      uri: config.datasources.mongodb.uri,
    };
  },
  inject: [AppConfig],
});

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, DatabaseModule, SecretModule, SplitwiseModule, SourcesModule, ImportModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(private config: ServerConfig, private appService: AppService) {}

  onApplicationBootstrap() {
    this.logger.log(`Start ${this.appService.infoToString()} on http://localhost:${this.config.port}${this.config.basePath}`);
    this.logger.log(`Documentation on http://localhost:${this.config.port}${this.config.basePath}/doc`);
    this.logger.log(`Explorer on http://localhost:${this.config.port}${this.config.basePath}/explorer`);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
