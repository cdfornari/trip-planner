import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import Surreal, { RecordId } from 'surrealdb';
import { DomainEvent } from 'libs/core/domain/events';
import { EventStoreService } from 'libs/core/infrastructure/event-store/event-store.service';
import { Projector } from 'libs/core/infrastructure/event-store/projector.decorator';
import { SubscribeToGroup } from 'libs/core/infrastructure/event-store/subscribe-to-group.decorator';
import { InjectSurreal } from 'libs/core/infrastructure/surrealdb/inject-surreal.decorator';
import {
  TripPlanRequested,
  TripPlanRequestedEvent,
} from 'libs/trip-plans/domain/events/trip-plan-requested.event';
import {
  FlightsBooked,
  FlightsBookedEvent,
} from 'libs/trip-plans/domain/events/flights-booked.event';
import {
  FlightsBookingFailed,
  FlightsBookingFailedEvent,
} from 'libs/trip-plans/domain/events/flights-booking-failed.event';
import {
  HotelBooked,
  HotelBookedEvent,
} from 'libs/trip-plans/domain/events/hotel-booked.event';
import { HotelBookingFailed } from 'libs/trip-plans/domain/events/hotel-booking-failed.event';
import {
  VehicleRentalBooked,
  VehicleRentalBookedEvent,
} from 'libs/trip-plans/domain/events/vehicle-rental-booked.event';
import {
  VehicleRentalFailed,
  VehicleRentalFailedEvent,
} from 'libs/trip-plans/domain/events/vehicle-rental-failed.event';
import {
  ActivityBooked,
  ActivityBookedEvent,
} from 'libs/trip-plans/domain/events/activity-booked.event';
import {
  ActivitiesBookingFailed,
  ActivitiesBookingFailedEvent,
} from 'libs/trip-plans/domain/events/activities-booking-failed.event';
import {
  TripPlanCompleted,
  TripPlanCompletedEvent,
} from 'libs/trip-plans/domain/events/trip-plan-completed.event';
import {
  TripPlanFailed,
  TripPlanFailedEvent,
} from 'libs/trip-plans/domain/events/trip-plan-failed.event';

const SUBSCRIPTION_GROUP = 'surrealdb-trip-plan-projector';

@Projector
@Injectable()
export class SureealDbProjector implements OnApplicationBootstrap {
  constructor(
    private readonly eventStore: EventStoreService,
    @InjectSurreal() private readonly surreal: Surreal,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.eventStore.createSubscriptionGroup('ALL', SUBSCRIPTION_GROUP);
      await this.surreal.query('DEFINE TABLE IF NOT EXISTS trip SCHEMALESS;');
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeToGroup(SUBSCRIPTION_GROUP)
  async onEvent(
    event: DomainEvent,
    ack: () => Promise<void>,
    nack: (error: any) => Promise<void>,
  ) {
    try {
      //console.log(event);
      const handler = this[`on${event.name}`];
      if (handler) await handler.call(this, event);
      await ack();
    } catch (error) {
      console.log(error);
      await nack(error);
    }
  }

  async [`on${TripPlanRequested.name}`](event: TripPlanRequestedEvent) {
    this.surreal.create(new RecordId('trip', event.dispatcherId), {
      ...event.context,
      status: 'REQUESTED',
      planeTickets: [],
      activities: [],
    });
  }

  async [`on${FlightsBooked.name}`](event: FlightsBookedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      status: 'PLANNING',
      planeTickets: event.context.tickets,
    });
  }

  async [`on${FlightsBookingFailed.name}`](event: FlightsBookingFailedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      planeTickets: [],
    });
  }

  async [`on${HotelBooked.name}`](event: HotelBookedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      hotelBooking: event.context,
    });
  }

  async [`on${HotelBookingFailed.name}`](event: FlightsBookingFailedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      hotelBooking: undefined,
    });
  }

  async [`on${VehicleRentalBooked.name}`](event: VehicleRentalBookedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      vehicleRental: event.context,
    });
  }

  async [`on${VehicleRentalFailed.name}`](event: VehicleRentalFailedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      vehicleRental: undefined,
    });
  }

  async [`on${ActivityBooked.name}`](event: ActivityBookedEvent) {
    this.surreal.query(
      `UPDATE trip:${'`' + event.dispatcherId + '`'} SET activities += $activity`,
      {
        activity: event.context,
      },
    );
  }

  async [`on${ActivitiesBookingFailed.name}`](
    event: ActivitiesBookingFailedEvent,
  ) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      activities: [],
    });
  }

  async [`on${TripPlanCompleted.name}`](event: TripPlanCompletedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      status: 'COMPLETED',
    });
  }

  async [`on${TripPlanFailed.name}`](event: TripPlanFailedEvent) {
    this.surreal.merge(new RecordId('trip', event.dispatcherId), {
      status: 'FAILED',
    });
  }
}
