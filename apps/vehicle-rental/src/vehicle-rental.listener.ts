import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventStoreService } from 'libs/core/infrastructure/event-store/event-store.service';
import { SagaStep } from 'libs/core/infrastructure/event-store/saga-step.decorator';
import { SubscribeToGroup } from 'libs/core/infrastructure/event-store/subscribe-to-group.decorator';
import { UuidGenerator } from 'libs/core/infrastructure/uuid/uuid-generator';
import { BookVehicleRentalCommandHandler } from 'libs/trip-plans/application/book-vehicle-rental.command-handler';
import { FailBookingVehicleRentalCommandHandler } from 'libs/trip-plans/application/fail-booking-vehicle-rental.command-handler';
import {
  ActivitiesBookingFailed,
  ActivitiesBookingFailedEvent,
} from 'libs/trip-plans/domain/events/activities-booking-failed.event';
import {
  HotelBooked,
  HotelBookedEvent,
} from 'libs/trip-plans/domain/events/hotel-booked.event';
import { FindVehicleRentalServiceSimulation } from 'libs/trip-plans/infrastructure/find-vehicle-rental.service';

const SUBSCRIPTION_GROUP = 'book-vehicle-rental-listener';
const SUBSCRIPTION_GROUP_COMPENSATION = 'book-vehicle-rental-compensation';

@SagaStep
@Injectable()
export class VehicleRentalListener implements OnApplicationBootstrap {
  constructor(private readonly eventStore: EventStoreService) {}

  async onApplicationBootstrap() {
    await this.eventStore.createSubscriptionGroup(
      HotelBooked.name,
      SUBSCRIPTION_GROUP,
    );
    await this.eventStore.createSubscriptionGroup(
      ActivitiesBookingFailed.name,
      SUBSCRIPTION_GROUP_COMPENSATION,
    );
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP)
  async onEvent(
    event: HotelBookedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = BookVehicleRentalCommandHandler(
      this.eventStore,
      FindVehicleRentalServiceSimulation(new UuidGenerator()),
    );
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP_COMPENSATION)
  async compensate(
    event: ActivitiesBookingFailedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = FailBookingVehicleRentalCommandHandler(
      this.eventStore,
    );
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }
}
