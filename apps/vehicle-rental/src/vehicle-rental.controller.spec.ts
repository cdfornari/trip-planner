import { Test, TestingModule } from '@nestjs/testing';
import { VehicleRentalController } from './vehicle-rental.controller';
import { VehicleRentalService } from './vehicle-rental.service';

describe('VehicleRentalController', () => {
  let vehicleRentalController: VehicleRentalController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VehicleRentalController],
      providers: [VehicleRentalService],
    }).compile();

    vehicleRentalController = app.get<VehicleRentalController>(VehicleRentalController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(vehicleRentalController.getHello()).toBe('Hello World!');
    });
  });
});
