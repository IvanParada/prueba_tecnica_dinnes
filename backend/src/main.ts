import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de solicitudes de atención')
    .setDescription(
      'API REST para administrar solicitudes de clientes.',
    )
    .setVersion('1.0')
    .build();

  const swaggerDocument =
    SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

  SwaggerModule.setup(
    'docs',
    app,
    swaggerDocument,
    {
      useGlobalPrefix: true,
    },
  );
  
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
