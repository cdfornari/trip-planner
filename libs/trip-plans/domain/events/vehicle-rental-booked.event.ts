import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';
import { VehicleRental } from '../entities/vehicle-rental';

export type VehicleRentalBookedEvent = DomainEvent<VehicleRentalBooked>;

export class VehicleRentalBooked {
  private constructor() {}
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleBrand: string;
  vehicleCapacity: number;
  vehicleYear: number;
  price: {
    currency: string;
    amount: number;
  };

  static createEvent(
    dispatcher: TripPlan,
    vehicleRental: VehicleRental,
  ): VehicleRentalBookedEvent {
    return DomainEventFactory<VehicleRentalBooked>({
      dispatcher,
      name: VehicleRentalBooked.name,
      context: {
        id: vehicleRental.id.value,
        vehiclePlate: vehicleRental.vehiclePlate.value,
        vehicleModel: vehicleRental.vehicleModel.value,
        vehicleBrand: vehicleRental.vehicleBrand.value,
        vehicleCapacity: vehicleRental.vehicleCapacity.value,
        vehicleYear: vehicleRental.vehicleYear.value,
        price: {
          currency: vehicleRental.price.currency.valueOf(),
          amount: vehicleRental.price.value,
        },
      },
    });
  }
}
