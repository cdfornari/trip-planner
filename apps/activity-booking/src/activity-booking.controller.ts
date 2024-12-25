import { Controller, Get } from '@nestjs/common';
import { ActivityBookingService } from './activity-booking.service';

@Controller()
export class ActivityBookingController {
  constructor(private readonly activityBookingService: ActivityBookingService) {}

  @Get()
  getHello(): string {
    return this.activityBookingService.getHello();
  }
}
