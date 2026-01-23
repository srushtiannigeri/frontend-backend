// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';

// async function bootstrap() {
//   dotenv.config();

//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api');

//   const port = process.env.PORT || 4000;
//   await app.listen(port);
//   // eslint-disable-next-line no-console
//   console.log(`Certisure NestJS backend listening on port ${port}`);
// }

// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  // Enable CORS for demo
  app.enableCors({
    origin: true, // Allow all origins for demo (in production, specify exact origins)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Certisure NestJS backend listening on port ${port}`);
}

bootstrap();


