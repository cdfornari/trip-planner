import { Module } from '@nestjs/common';
import { FlightBookingController } from './flight-booking.controller';
import { FlightBookingService } from './flight-booking.service';

@Module({
  imports: [],
  controllers: [FlightBookingController],
  providers: [FlightBookingService],
})
export class FlightBookingModule {}
