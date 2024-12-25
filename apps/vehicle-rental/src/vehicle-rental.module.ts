import { Module } from '@nestjs/common';
import { VehicleRentalController } from './vehicle-rental.controller';
import { VehicleRentalService } from './vehicle-rental.service';

@Module({
  imports: [],
  controllers: [VehicleRentalController],
  providers: [VehicleRentalService],
})
export class VehicleRentalModule {}
