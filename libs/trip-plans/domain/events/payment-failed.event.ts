import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';

export type PaymentFailedEvent = DomainEvent<PaymentFailed>;

export class PaymentFailed {
  private constructor() {}

  static createEvent(dispatcher: TripPlan): PaymentFailedEvent {
    return DomainEventFactory<PaymentFailed>({
      dispatcher,
      name: PaymentFailed.name,
      context: {},
    });
  }
}
