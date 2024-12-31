import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type TripPlanFailedEvent = DomainEvent<TripPlanFailed>;

export class TripPlanFailed {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): TripPlanFailedEvent {
    return DomainEventFactory<TripPlanFailed>({
      dispatcher,
      name: TripPlanFailed.name,
      context: {},
    });
  }
}
