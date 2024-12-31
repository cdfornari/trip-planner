import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type ActivitiesBookingFailedEvent = DomainEvent<ActivitiesBookingFailed>;

export class ActivitiesBookingFailed {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): ActivitiesBookingFailedEvent {
    return DomainEventFactory<ActivitiesBookingFailed>({
      dispatcher,
      name: ActivitiesBookingFailed.name,
      context: {},
    });
  }
}
