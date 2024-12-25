import { Injectable } from '@nestjs/common';

@Injectable()
export class VehicleRentalService {
  getHello(): string {
    return 'Hello World!';
  }
}
