import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventStoreService } from 'libs/core/infrastructure/event-store/event-store.service';
import { SagaStep } from 'libs/core/infrastructure/event-store/saga-step.decorator';
import { SubscribeToGroup } from 'libs/core/infrastructure/event-store/subscribe-to-group.decorator';
import { UuidGenerator } from 'libs/core/infrastructure/uuid/uuid-generator';
import { BookFlightsCommandHandler } from 'libs/trip-plans/application/book-flights.command-handler';
import { FailBookingFlightsCommandHandler } from 'libs/trip-plans/application/fail-booking-flights.command-handler';
import {
  HotelBookingFailed,
  HotelBookingFailedEvent,
} from 'libs/trip-plans/domain/events/hotel-booking-failed.event';
import {
  TripPlanRequested,
  TripPlanRequestedEvent,
} from 'libs/trip-plans/domain/events/trip-plan-requested.event';
import { FindPlaneTicketsServiceSimulation } from 'libs/trip-plans/infrastructure/find-plane-tickets.service';

const SUBSCRIPTION_GROUP = 'book-flight-listener';
const SUBSCRIPTION_GROUP_COMPENSATION = 'book-flight-compensation';

@Injectable()
@SagaStep
export class FlightBookingListener implements OnApplicationBootstrap {
  constructor(private readonly eventStore: EventStoreService) {}

  async onApplicationBootstrap() {
    await this.eventStore.createSubscriptionGroup(
      TripPlanRequested.name,
      SUBSCRIPTION_GROUP,
    );
    await this.eventStore.createSubscriptionGroup(
      HotelBookingFailed.name,
      SUBSCRIPTION_GROUP_COMPENSATION,
    );
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP)
  async onEvent(
    event: TripPlanRequestedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = BookFlightsCommandHandler(
      this.eventStore,
      FindPlaneTicketsServiceSimulation(new UuidGenerator()),
    );
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP_COMPENSATION)
  async compensate(
    event: HotelBookingFailedEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    const commandHandler = FailBookingFlightsCommandHandler(this.eventStore);
    const result = await commandHandler({ tripPlanId: event.dispatcherId });
    console.log(result.unwrap());
    await ack();
  }
}
