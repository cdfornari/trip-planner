import { AggregateRoot } from 'libs/core/domain/aggregate-root';
import { DomainEvent } from 'libs/core/domain/events';
import { PaymentId } from './value-objects/payment-id';
import { InvalidPaymentException } from './exceptions/invalid-payment.exception';
import { PaymentAmount } from './value-objects/payment-amount';
import { PaymentDate } from './value-objects/payment-date';
import { PaymentMethod } from './value-objects/payment-method';
import { PaymentCreated } from './events/payment-created';
import { UserId } from 'libs/users/domain/value-objects/user-id';
import { TripPlanId } from 'libs/trip-plans/domain/value-objects/trip-plan-id';

export class Payment extends AggregateRoot<PaymentId> {
  private constructor(protected readonly _id: PaymentId) {
    super(_id);
  }

  protected validateState(): void {
    if (
      !this.id ||
      !this._amount ||
      !this._date ||
      !this._paymentMethod ||
      !this._user ||
      !this._tripPlan
    ) {
      throw new InvalidPaymentException();
    }
  }

  private _amount: PaymentAmount;
  private _date: PaymentDate;
  private _paymentMethod: PaymentMethod;
  private _user: UserId;
  private _tripPlan: TripPlanId;

  get id(): PaymentId {
    return this._id;
  }

  get uid(): string {
    return this._id.value;
  }

  get amount(): PaymentAmount {
    return this._amount;
  }

  get date(): PaymentDate {
    return this._date;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  static create(
    id: PaymentId,
    data: {
      amount: PaymentAmount;
      date: PaymentDate;
      paymentMethod: PaymentMethod;
      user: UserId;
      tripPlan: TripPlanId;
    },
  ): Payment {
    const payment = new Payment(id);
    payment.apply(
      PaymentCreated.createEvent(
        payment,
        data.amount,
        data.date,
        data.paymentMethod,
        data.user,
        data.tripPlan,
      ),
    );
    return payment;
  }

  static loadFromHistory(id: PaymentId, events: DomainEvent[]): Payment {
    const payment = new Payment(id);
    payment.hydrate(events);
    return payment;
  }

  [`on${PaymentCreated.name}`](context: PaymentCreated): void {
    this._amount = new PaymentAmount(context.amount);
    this._date = new PaymentDate(context.date);
    this._paymentMethod = new PaymentMethod(context.paymentMethod);
  }
}
