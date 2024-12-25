import { Module } from '@nestjs/common';
import { ActivityBookingController } from './activity-booking.controller';
import { ActivityBookingService } from './activity-booking.service';

@Module({
  imports: [],
  controllers: [ActivityBookingController],
  providers: [ActivityBookingService],
})
export class ActivityBookingModule {}
