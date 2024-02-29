import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //создание свагер документации
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //Мы начнем с привязки ValidationPipe на уровне приложения, чтобы обеспечить защиту всех конечных точек от получения неверных данных.
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(8080);
}

//логирование
bootstrap().then(() => Logger.log('COOOL!!'));
