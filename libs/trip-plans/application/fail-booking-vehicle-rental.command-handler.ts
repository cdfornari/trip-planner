import { EventStore } from 'libs/core/application/event-store';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { TripPlan } from '../domain/trip-plan';
import { TripPlanId } from '../domain/value-objects/trip-plan-id';

export type FailBookingVehicleRentalCommand = {
  tripPlanId: string;
};

export type FailBookingVehicleRentalResponse = {
  id: string;
};

export const FailBookingVehicleRentalCommandHandler =
  (
    eventStore: EventStore,
  ): ApplicationService<
    FailBookingVehicleRentalCommand,
    FailBookingVehicleRentalResponse
  > =>
  async (command: FailBookingVehicleRentalCommand) => {
    const events = await eventStore.getEventsByStream(command.tripPlanId);
    if (events.length === 0) {
      return Result.failure(new Error('TRIP_PLAN_NOT_FOUND'));
    }
    const tripPlan = TripPlan.loadFromHistory(
      new TripPlanId(command.tripPlanId),
      events,
    );
    tripPlan.failBookingVehicleRental();
    await eventStore.appendEventsFrom(tripPlan);
    return Result.success({
      id: tripPlan.id.value,
    });
  };
