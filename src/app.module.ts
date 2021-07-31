import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/Logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { StatsModule } from './stats/stats.module';
import { RepoModule } from './repo/repo.module';
import { TopLanguagesModule } from './top-languages/top-languages.module';

// Load ENV
const ENV = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV.NODE_ENV ? '.env' : `.env.${ENV.NODE_ENV}`,
    }),
    StatsModule,
    RepoModule,
    TopLanguagesModule,
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
