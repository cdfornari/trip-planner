import { Controller, Get } from '@nestjs/common';
import { VehicleRentalService } from './vehicle-rental.service';

@Controller()
export class VehicleRentalController {
  constructor(private readonly vehicleRentalService: VehicleRentalService) {}

  @Get()
  getHello(): string {
    return this.vehicleRentalService.getHello();
  }
}
