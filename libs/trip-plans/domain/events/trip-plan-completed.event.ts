import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type TripPlanCompletedEvent = DomainEvent<TripPlanCompleted>;

export class TripPlanCompleted {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): TripPlanCompletedEvent {
    return DomainEventFactory<TripPlanCompleted>({
      dispatcher,
      name: TripPlanCompleted.name,
      context: {},
    });
  }
}
