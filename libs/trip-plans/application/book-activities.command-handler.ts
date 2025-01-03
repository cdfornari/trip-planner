import { EventStore } from 'libs/core/application/event-store';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { TripPlan } from '../domain/trip-plan';
import { TripPlanId } from '../domain/value-objects/trip-plan-id';
import { FindActivitiesService } from '../domain/services/find-activities.service';

export type BookActivitiesCommand = {
  tripPlanId: string;
};

export type BookActivitiesResponse = {
  id: string;
};

export const BookActivitiesCommandHandler =
  (
    eventStore: EventStore,
    findActivitiesService: FindActivitiesService,
  ): ApplicationService<BookActivitiesCommand, BookActivitiesResponse> =>
  async (command: BookActivitiesCommand) => {
    const events = await eventStore.getEventsByStream(command.tripPlanId);
    if (events.length === 0) {
      return Result.failure(new Error('TRIP_PLAN_NOT_FOUND'));
    }
    const tripPlan = TripPlan.loadFromHistory(
      new TripPlanId(command.tripPlanId),
      events,
    );
    try {
      const activities = await findActivitiesService(tripPlan);
      if (activities.length === 0) tripPlan.skipBookingActivities();
      else activities.forEach((activity) => tripPlan.bookActivity(activity));
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    } catch {
      tripPlan.failBookingActivities();
      await eventStore.appendEventsFrom(tripPlan);
      return Result.success({
        id: tripPlan.id.value,
      });
    }
  };
