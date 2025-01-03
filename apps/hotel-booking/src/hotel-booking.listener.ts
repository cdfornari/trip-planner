import { Injectable } from '@nestjs/common';
import { EventStoreService } from 'libs/core/infrastructure/event-store/event-store.service';
import { SagaStep } from 'libs/core/infrastructure/event-store/saga-step.decorator';
import { SubscribeToGroup } from 'libs/core/infrastructure/event-store/subscribe-to-group.decorator';
import { UuidGenerator } from 'libs/core/infrastructure/uuid/uuid-generator';
import { BookHotelCommandHandler } from 'libs/trip-plans/application/book-hotel.command-handler';
import { FailBookingHotelCommandHandler } from 'libs/trip-plans/application/fail-booking-hotel.command-handler';
import {
  FlightsBooked,
  FlightsBookedEvent,
} from 'libs/trip-plans/domain/events/flights-booked.event';
import {
  VehicleRentalFailed,
  VehicleRentalFailedEvent,
} from 'libs/trip-plans/domain/events/vehicle-rental-failed.event';
import { FindHotelServiceSimulation } from 'libs/trip-plans/infrastructure/find-hotel.service';

const SUBSCRIPTION_GROUP = 'book-hotel-listener';
const SUBSCRIPTION_GROUP_COMPENSATION = 'book-hotel-compensation';

@SagaStep
@Injectable()
export class HotelBookingListener {
  constructor(private readonly eventStore: EventStoreService) {}

  async onApplicationBootstrap() {
    await this.eventStore.createSubscriptionGroup(
      FlightsBooked.name,
      SUBSCRIPTION_GROUP,
    );
    await this.eventStore.createSubscriptionGroup(
      VehicleRentalFailed.name,
      SUBSCRIPTION_GROUP_COMPENSATION,
    );
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP)
  async onEvent(
    event: FlightsBookedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = BookHotelCommandHandler(
      this.eventStore,
      FindHotelServiceSimulation(new UuidGenerator()),
    );
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP_COMPENSATION)
  async compensate(
    event: VehicleRentalFailedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = FailBookingHotelCommandHandler(this.eventStore);
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }
}
