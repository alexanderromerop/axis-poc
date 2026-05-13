import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(require('express').text({ type: 'application/soap+xml' }));
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
