import { NestFactory } from '@nestjs/core';
import { QueryApiModule } from './query-api.module';

async function bootstrap() {
  const app = await NestFactory.create(QueryApiModule);
  app.enableCors();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
