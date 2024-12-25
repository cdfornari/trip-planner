import { NestFactory } from '@nestjs/core';
import { ProjectorsModule } from './projectors.module';

async function bootstrap() {
  const app = await NestFactory.create(ProjectorsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
