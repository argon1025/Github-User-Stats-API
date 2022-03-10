import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/Logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { StatsModule } from './stats/stats.module';
import { TokenManagerModule } from './tokenManager/toeknManager.module';
import { RepoModule } from './repo/repo.module';
import { UsersModule } from './users/users.module';
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
    UsersModule,
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
