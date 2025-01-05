import { EventStore } from 'libs/core/application/event-store';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { TripPlan } from '../domain/trip-plan';
import { TripPlanId } from '../domain/value-objects/trip-plan-id';
import { FindVehicleRentalService } from '../domain/services/find-vehicle-rental.service';

export type BookVehicleRentalCommand = {
  tripPlanId: string;
};

export type BookVehicleRentalResponse = {
  id: string;
};

export const BookVehicleRentalCommandHandler =
  (
    eventStore: EventStore,
    findVehicleRentalService: FindVehicleRentalService,
  ): ApplicationService<BookVehicleRentalCommand, BookVehicleRentalResponse> =>
  async (command: BookVehicleRentalCommand) => {
    const events = await eventStore.getEventsByStream(command.tripPlanId);
    if (events.length === 0) {
      return Result.failure(new Error('TRIP_PLAN_NOT_FOUND'));
    }
    const tripPlan = TripPlan.loadFromHistory(
      new TripPlanId(command.tripPlanId),
      events,
    );
    try {
      const vehicleRental = await findVehicleRentalService(tripPlan);
      tripPlan.bookVehicleRental(vehicleRental);
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    } catch(error) {
      console.log(error);
      tripPlan.skipVehicleRental();
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    }
  };
