import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { corsOptions } from './constants/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  const configService = app.get(ConfigService);

  app.enableCors(corsOptions);

  const PORT = configService.get<number>('PORT') || 3000;

  app.setGlobalPrefix('api');

  await app.listen(PORT, () => {
    console.log(`Application is running on: http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
