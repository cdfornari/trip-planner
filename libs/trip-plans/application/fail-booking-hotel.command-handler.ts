import { EventStore } from 'libs/core/application/event-store';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { TripPlan } from '../domain/trip-plan';
import { TripPlanId } from '../domain/value-objects/trip-plan-id';

export type FailBookingHotelCommand = {
  tripPlanId: string;
};

export type FailBookingHotelResponse = {
  id: string;
};

export const FailBookingHotelCommandHandler =
  (
    eventStore: EventStore,
  ): ApplicationService<FailBookingHotelCommand, FailBookingHotelResponse> =>
  async (command: FailBookingHotelCommand) => {
    const events = await eventStore.getEventsByStream(command.tripPlanId);
    if (events.length === 0) {
      return Result.failure(new Error('TRIP_PLAN_NOT_FOUND'));
    }
    const tripPlan = TripPlan.loadFromHistory(
      new TripPlanId(command.tripPlanId),
      events,
    );
    tripPlan.failBookingHotel();
    await eventStore.appendEventsFrom(tripPlan);
    return Result.success({
      id: tripPlan.id.value,
    });
  };
