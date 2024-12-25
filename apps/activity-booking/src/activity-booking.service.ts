import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityBookingService {
  getHello(): string {
    return 'Hello World!';
  }
}
