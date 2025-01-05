import { EventStore } from 'libs/core/application/event-store';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { TripPlan } from '../domain/trip-plan';
import { TripPlanId } from '../domain/value-objects/trip-plan-id';
import { FindHotelService } from '../domain/services/find-hotel.service';

export type BookHotelCommand = {
  tripPlanId: string;
};

export type BookHotelResponse = {
  id: string;
};

export const BookHotelCommandHandler =
  (
    eventStore: EventStore,
    findHotelService: FindHotelService,
  ): ApplicationService<BookHotelCommand, BookHotelResponse> =>
  async (command: BookHotelCommand) => {
    const events = await eventStore.getEventsByStream(command.tripPlanId);
    if (events.length === 0) {
      return Result.failure(new Error('TRIP_PLAN_NOT_FOUND'));
    }
    const tripPlan = TripPlan.loadFromHistory(
      new TripPlanId(command.tripPlanId),
      events,
    );
    try {
      const hotel = await findHotelService(tripPlan);
      tripPlan.bookHotel(hotel);
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    } catch (error) {
      console.log(error);
      tripPlan.failBookingHotel();
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    }
  };
