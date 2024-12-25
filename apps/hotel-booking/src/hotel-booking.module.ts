import { Module } from '@nestjs/common';
import { HotelBookingController } from './hotel-booking.controller';
import { HotelBookingService } from './hotel-booking.service';

@Module({
  imports: [],
  controllers: [HotelBookingController],
  providers: [HotelBookingService],
})
export class HotelBookingModule {}
