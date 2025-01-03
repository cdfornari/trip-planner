import { DomainService } from 'libs/core/domain/services';
import { TripPlan } from '../trip-plan';
import { VehicleRental } from '../entities/vehicle-rental';

export type FindVehicleRentalService = DomainService<
  TripPlan,
  Promise<VehicleRental>
>;
