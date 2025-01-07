import { Injectable } from '@nestjs/common';
import { EventStoreService } from 'libs/core/infrastructure/event-store/event-store.service';
import { SagaStep } from 'libs/core/infrastructure/event-store/saga-step.decorator';
import { SubscribeToGroup } from 'libs/core/infrastructure/event-store/subscribe-to-group.decorator';
import { UuidGenerator } from 'libs/core/infrastructure/uuid/uuid-generator';
import { PayTripPlanCommandHandler } from 'libs/payments/application/pay-trip-plan.command-handler';
import { CryptoPaymentGatewayServiceSimulation } from 'libs/payments/infrastructure/crypto-payment-gateway.service';
import {
  ActivitiesBookingFinished,
  ActivitiesBookingFinishedEvent,
} from 'libs/trip-plans/domain/events/activities-booking-finished.event';
import {
  ActivitiesBookingSkipped,
  ActivitiesBookingSkippedEvent,
} from 'libs/trip-plans/domain/events/activities-booking-skipped.event';

const SUBSCRIPTION_GROUP = 'book-activity-listener';

@SagaStep
@Injectable()
export class BillingListener {
  constructor(private readonly eventStore: EventStoreService) {}

  @SubscribeToGroup(
    [ActivitiesBookingFinished.name, ActivitiesBookingSkipped.name],
    SUBSCRIPTION_GROUP,
  )
  async onEvent(
    event: ActivitiesBookingFinishedEvent | ActivitiesBookingSkippedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = PayTripPlanCommandHandler(
      this.eventStore,
      CryptoPaymentGatewayServiceSimulation(),
      new UuidGenerator(),
    );
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }
}
