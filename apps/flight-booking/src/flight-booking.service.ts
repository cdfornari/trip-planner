import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightBookingService {
  getHello(): string {
    return 'Hello World!';
  }
}
