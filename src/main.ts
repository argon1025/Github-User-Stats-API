import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './ExceptionFilters/HttpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration Load
  const configService = app.get<ConfigService>(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT', null);
  const SERVER_ENV = configService.get<string>('NODE_ENV', null);
  const SERVER_HOST = configService.get<string>('SERVER_HOST', 'null');

  // ExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuration Load ERROR
  if (SERVER_PORT === null) {
    // error logging
    Logger.error('SERVER_ENV is not defined');
  } else {
    // start server
    await app.listen(SERVER_PORT);
    Logger.log(`${SERVER_ENV} server http://${SERVER_HOST}:${SERVER_PORT}`, 'SERVER_INFO');
  }
}
bootstrap();
