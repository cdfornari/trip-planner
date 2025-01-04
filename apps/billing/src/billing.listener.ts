import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
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
const SUBSCRIPTION_GROUP_ALT = 'book-activity-listener-alt';

@SagaStep
@Injectable()
export class BillingListener implements OnApplicationBootstrap {
  constructor(private readonly eventStore: EventStoreService) {}

  async onApplicationBootstrap() {
    await this.eventStore.createSubscriptionGroup(
      ActivitiesBookingFinished.name,
      SUBSCRIPTION_GROUP,
    );
    await this.eventStore.createSubscriptionGroup(
      ActivitiesBookingSkipped.name,
      SUBSCRIPTION_GROUP_ALT,
    );
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP)
  async onEvent(
    event: ActivitiesBookingFinishedEvent,
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

  @SubscribeToGroup(SUBSCRIPTION_GROUP_ALT)
  async onEventAlt(
    event: ActivitiesBookingSkippedEvent,
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
