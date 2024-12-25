import { Test, TestingModule } from '@nestjs/testing';
import { HotelBookingController } from './hotel-booking.controller';
import { HotelBookingService } from './hotel-booking.service';

describe('HotelBookingController', () => {
  let hotelBookingController: HotelBookingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HotelBookingController],
      providers: [HotelBookingService],
    }).compile();

    hotelBookingController = app.get<HotelBookingController>(HotelBookingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(hotelBookingController.getHello()).toBe('Hello World!');
    });
  });
});
