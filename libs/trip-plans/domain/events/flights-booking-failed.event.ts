import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type FlightsBookingFailedEvent = DomainEvent<FlightsBookingFailed>;

export class FlightsBookingFailed {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): FlightsBookingFailedEvent {
    return DomainEventFactory<FlightsBookingFailed>({
      dispatcher,
      name: FlightsBookingFailed.name,
      context: {},
    });
  }
}
