import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('BotHub')
    .setDescription('bothub tes app swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerCustomOptions: SwaggerCustomOptions = {
    customCss:
      '.swagger-ui .topbar { display: none }' +
      '.swagger-ui .info { margin: 20px 0; }' +
      '.swagger-ui > div > .scheme-container { padding: 10px 0;position: fixed; z-index: 100; }',
    customJs: '',
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();
