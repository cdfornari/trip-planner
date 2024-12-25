import { Injectable } from '@nestjs/common';

@Injectable()
export class HotelBookingService {
  getHello(): string {
    return 'Hello World!';
  }
}
