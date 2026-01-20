import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Certisure NestJS backend listening on port ${port}`);
}

bootstrap();


