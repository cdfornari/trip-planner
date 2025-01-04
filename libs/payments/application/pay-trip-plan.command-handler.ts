import { EventStore } from 'libs/core/application/event-store';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { CryptoPaymentGateway } from './payment-gateway';
import { TripPlan } from 'libs/trip-plans/domain/trip-plan';
import { TripPlanId } from 'libs/trip-plans/domain/value-objects/trip-plan-id';
import { UserId } from 'libs/users/domain/value-objects/user-id';
import { User } from 'libs/users/domain/user';
import { Payment } from '../domain/payment';
import { PaymentId } from '../domain/value-objects/payment-id';
import { IdGenerator } from 'libs/core/application/id-generator';
import { PaymentAmount } from '../domain/value-objects/payment-amount';
import { PaymentDate } from '../domain/value-objects/payment-date';
import { PaymentMethod } from '../domain/value-objects/payment-method';

export type PayTripPlanCommand = {
  tripPlanId: string;
};

export type PayTripPlanResponse = {
  id: string;
};

export const PayTripPlanCommandHandler =
  (
    eventStore: EventStore,
    paymentsGateway: CryptoPaymentGateway,
    idGenerator: IdGenerator<string>,
  ): ApplicationService<PayTripPlanCommand, PayTripPlanResponse> =>
  async (command: PayTripPlanCommand) => {
    const events = await eventStore.getEventsByStream(command.tripPlanId);
    if (events.length === 0) {
      return Result.failure(new Error('TRIP_PLAN_NOT_FOUND'));
    }
    const tripPlan = TripPlan.loadFromHistory(
      new TripPlanId(command.tripPlanId),
      events,
    );
    try {
      const userEvents = await eventStore.getEventsByStream(
        tripPlan.requestedBy.value,
      );
      if (userEvents.length === 0) {
        return Result.failure(new Error('USER_NOT_FOUND'));
      }
      const user = User.loadFromHistory(
        new UserId(tripPlan.requestedBy.value),
        userEvents,
      );
      const paymentResult = await paymentsGateway(
        user.wallet.value,
        tripPlan.totalCost,
      );
      if (paymentResult.isFailure) paymentResult.unwrap();
      const payment = Payment.create(new PaymentId(idGenerator.generateId()), {
        amount: new PaymentAmount(tripPlan.totalCost),
        tripPlan: tripPlan.id,
        user: user.id,
        date: new PaymentDate(new Date()),
        paymentMethod: new PaymentMethod('WALLET'),
      });
      await eventStore.appendEventsFrom(payment);
      tripPlan.complete();
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    } catch {
      tripPlan.fail();
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    }
  };
