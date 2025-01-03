import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type VehicleRentalSkippedEvent = DomainEvent<VehicleRentalSkipped>;

export class VehicleRentalSkipped {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): VehicleRentalSkippedEvent {
    return DomainEventFactory<VehicleRentalSkipped>({
      dispatcher,
      name: VehicleRentalSkipped.name,
      context: {},
    });
  }
}
