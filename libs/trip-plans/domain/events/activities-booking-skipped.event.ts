import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type ActivitiesBookingSkippedEvent =
  DomainEvent<ActivitiesBookingSkipped>;

export class ActivitiesBookingSkipped {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): ActivitiesBookingSkippedEvent {
    return DomainEventFactory<ActivitiesBookingSkipped>({
      dispatcher,
      name: ActivitiesBookingSkipped.name,
      context: {},
    });
  }
}
