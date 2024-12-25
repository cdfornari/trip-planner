import { NestFactory } from '@nestjs/core';
import { FlightBookingModule } from './flight-booking.module';

async function bootstrap() {
  const app = await NestFactory.create(FlightBookingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
