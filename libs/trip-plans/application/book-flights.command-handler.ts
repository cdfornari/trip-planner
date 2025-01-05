import { EventStore } from 'libs/core/application/event-store';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { TripPlan } from '../domain/trip-plan';
import { TripPlanId } from '../domain/value-objects/trip-plan-id';
import { FindPlaneTicketsService } from '../domain/services/find-plane-tickets.service';

export type BookFlightsCommand = {
  tripPlanId: string;
};

export type BookFlightsResponse = {
  id: string;
};

export const BookFlightsCommandHandler =
  (
    eventStore: EventStore,
    findPlaneTicketsService: FindPlaneTicketsService,
  ): ApplicationService<BookFlightsCommand, BookFlightsResponse> =>
  async (command: BookFlightsCommand) => {
    const events = await eventStore.getEventsByStream(command.tripPlanId);
    if (events.length === 0) {
      return Result.failure(new Error('TRIP_PLAN_NOT_FOUND'));
    }
    const tripPlan = TripPlan.loadFromHistory(
      new TripPlanId(command.tripPlanId),
      events,
    );
    try {
      const planeTickets = await findPlaneTicketsService(tripPlan);
      tripPlan.bookFlights(planeTickets);
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    } catch (error) {
      console.log(error);
      tripPlan.failBookingFlights();
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    }
  };
