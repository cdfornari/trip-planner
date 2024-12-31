import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type VehicleRentalFailedEvent = DomainEvent<VehicleRentalFailed>;

export class VehicleRentalFailed {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): VehicleRentalFailedEvent {
    return DomainEventFactory<VehicleRentalFailed>({
      dispatcher,
      name: VehicleRentalFailed.name,
      context: {},
    });
  }
}
