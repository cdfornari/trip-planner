import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type HotelBookingFailedEvent = DomainEvent<HotelBookingFailed>;

export class HotelBookingFailed {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): HotelBookingFailedEvent {
    return DomainEventFactory<HotelBookingFailed>({
      dispatcher,
      name: HotelBookingFailed.name,
      context: {},
    });
  }
}
