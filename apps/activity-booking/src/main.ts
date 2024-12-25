import { NestFactory } from '@nestjs/core';
import { ActivityBookingModule } from './activity-booking.module';

async function bootstrap() {
  const app = await NestFactory.create(ActivityBookingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
