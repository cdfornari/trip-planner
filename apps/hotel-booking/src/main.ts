import { NestFactory } from '@nestjs/core';
import { HotelBookingModule } from './hotel-booking.module';

async function bootstrap() {
  const app = await NestFactory.create(HotelBookingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
