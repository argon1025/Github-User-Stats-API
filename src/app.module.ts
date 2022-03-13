import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/Logger.middleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { StatsModule } from './stats/stats.module';
import { RepoModule } from './repo/repo.module';
import { TokenManagerModule } from './tokenManager/toeknManager.module';
import { GithubStatsModule } from './github-fetchers/github-fetchers.module';

// Load ENV
const ENV = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV.NODE_ENV ? '.env' : `.env.${ENV.NODE_ENV}`,
    }),
    StatsModule,
    TokenManagerModule,
    RepoModule,
    GithubStatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// Add Middlewares
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
