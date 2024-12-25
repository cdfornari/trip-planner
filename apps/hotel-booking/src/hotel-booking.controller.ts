import { Controller, Get } from '@nestjs/common';
import { HotelBookingService } from './hotel-booking.service';

@Controller()
export class HotelBookingController {
  constructor(private readonly hotelBookingService: HotelBookingService) {}

  @Get()
  getHello(): string {
    return this.hotelBookingService.getHello();
  }
}
