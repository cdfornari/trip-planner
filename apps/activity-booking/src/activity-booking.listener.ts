import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventStoreService } from 'libs/core/infrastructure/event-store/event-store.service';
import { SagaStep } from 'libs/core/infrastructure/event-store/saga-step.decorator';
import { SubscribeToGroup } from 'libs/core/infrastructure/event-store/subscribe-to-group.decorator';
import { UuidGenerator } from 'libs/core/infrastructure/uuid/uuid-generator';
import { BookActivitiesCommandHandler } from 'libs/trip-plans/application/book-activities.command-handler';
import { FailBookingActivitiesCommandHandler } from 'libs/trip-plans/application/fail-booking-activities.command-handler';
import { PaymentFailed, PaymentFailedEvent } from 'libs/trip-plans/domain/events/payment-failed.event';
import {
  VehicleRentalBooked,
  VehicleRentalBookedEvent,
} from 'libs/trip-plans/domain/events/vehicle-rental-booked.event';
import {
  VehicleRentalSkipped,
  VehicleRentalSkippedEvent,
} from 'libs/trip-plans/domain/events/vehicle-rental-skipped.event';
import { FindActivitiesServiceSimulation } from 'libs/trip-plans/infrastructure/find-activities.service';

const SUBSCRIPTION_GROUP = 'activities-booking-listener';
const SUBSCRIPTION_GROUP_COMPENSATION = 'activities-booking-compensation';

@SagaStep
@Injectable()
export class ActivityBookingListener implements OnApplicationBootstrap {
  constructor(private readonly eventStore: EventStoreService) {}

  async onApplicationBootstrap() {
    try {
      await this.eventStore.createSubscriptionGroup(
        [VehicleRentalBooked.name, VehicleRentalSkipped.name],
        SUBSCRIPTION_GROUP,
      );
      await this.eventStore.createSubscriptionGroup(
        PaymentFailed.name,
        SUBSCRIPTION_GROUP_COMPENSATION,
      );
    } catch {}
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP)
  async onEvent(
    event: VehicleRentalBookedEvent | VehicleRentalSkippedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = BookActivitiesCommandHandler(
      this.eventStore,
      FindActivitiesServiceSimulation(new UuidGenerator()),
    );
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP_COMPENSATION)
  async compensate(
    event: PaymentFailedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = FailBookingActivitiesCommandHandler(this.eventStore);
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }
}
