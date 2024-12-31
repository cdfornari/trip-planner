import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { PaymentAmount } from '../value-objects/payment-amount';
import { PaymentDate } from '../value-objects/payment-date';
import { PaymentMethod } from '../value-objects/payment-method';
import { Payment } from '../payment';
import { UserId } from 'libs/users/domain/value-objects/user-id';
import { TripPlanId } from 'libs/trip-plans/domain/value-objects/trip-plan-id';

export type PaymentCreatedEvent = DomainEvent<PaymentCreated>;

export class PaymentCreated {
  private constructor() {}
  amount: number;
  date: Date;
  paymentMethod: string;
  user: string;
  tripPlan: string;

  static createEvent(
    dispatcher: Payment,
    amount: PaymentAmount,
    date: PaymentDate,
    paymentMethod: PaymentMethod,
    user: UserId,
    tripPlan: TripPlanId,
  ): PaymentCreatedEvent {
    return DomainEventFactory<PaymentCreated>({
      dispatcher,
      name: PaymentCreated.name,
      context: {
        amount: amount.value,
        date: date.value,
        paymentMethod: paymentMethod.value,
        user: user.value,
        tripPlan: tripPlan.value,
      },
    });
  }
}
