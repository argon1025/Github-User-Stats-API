import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './ExceptionFilters/HttpException.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //Swagger
  const config = new DocumentBuilder().setTitle('Github State API').setDescription('Unlimited open API for github User Stats').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configuration Load
  const configService = app.get<ConfigService>(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT', 80);
  const SERVER_ENV = configService.get<string>('NODE_ENV', 'prod');
  const SERVER_HOST = configService.get<string>('SERVER_HOST', 'localhost');

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
