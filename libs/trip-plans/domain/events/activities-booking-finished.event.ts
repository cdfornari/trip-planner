import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type ActivitiesBookingFinishedEvent = DomainEvent<ActivitiesBookingFinished>;

export class ActivitiesBookingFinished {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): ActivitiesBookingFinishedEvent {
    return DomainEventFactory<ActivitiesBookingFinished>({
      dispatcher,
      name: ActivitiesBookingFinished.name,
      context: {},
    });
  }
}
