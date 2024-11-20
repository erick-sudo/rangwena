import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { KnownPrismaClientRequestErrorFilter } from './filters/filter.known_prisma_error';
import { ExcludeSensitiveDataInterceptor } from './interceptors/interceptor.sensitive-data';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './redis/RedisIoAdapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', { infer: true });
  const vueFrontEnd = configService.get<string>('VUE_FRONTEND');

  const redisIoAdapter = new RedisIoAdapter(app);

  const config = new DocumentBuilder()
    .setTitle('Rangwena class of 2013')
    .setDescription('The Rangwena API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await redisIoAdapter.connectToRedis().catch((error: any) => {
    console.log(error);
  });
  app.useWebSocketAdapter(redisIoAdapter);

  app.enableCors({
    origin: vueFrontEnd,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());

  // A global resource not found exception filter
  app.useGlobalFilters(new KnownPrismaClientRequestErrorFilter());

  // Glodal sensitive data interceptor
  app.useGlobalInterceptors(new ExcludeSensitiveDataInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port, '0.0.0.0');
}
bootstrap();
