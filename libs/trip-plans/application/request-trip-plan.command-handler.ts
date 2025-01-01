import { EventStore } from 'libs/core/application/event-store';
import { IdGenerator } from 'libs/core/application/id-generator';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { TripPlan } from '../domain/trip-plan';
import { TripPlanId } from '../domain/value-objects/trip-plan-id';
import { OriginCity } from '../domain/value-objects/origin-city';
import { DestinationCity } from '../domain/value-objects/destination-city';
import { UserId } from 'libs/users/domain/value-objects/user-id';
import { TripDateRange } from '../domain/value-objects/trip-date-range';
import { Traveler } from '../domain/entities/traveler';
import { TravelerId } from '../domain/value-objects/traveler-id';
import { TripBudget } from '../domain/value-objects/trip-budget';
import { TravelerName } from '../domain/value-objects/traveler-name';

export type RequestTripPlanCommand = {
  originCity: string;
  destinationCity: string;
  userId: string;
  budget: {
    currency: string;
    amount: number;
  };
  travelers: {
    name: string;
  }[];
  date: {
    start: Date;
    end: Date;
  };
};

export type RequestTripPlanResponse = {
  id: string;
};

export const RequestTripPlanCommandHandler =
  (
    eventStore: EventStore,
    idGenerator: IdGenerator<string>,
  ): ApplicationService<RequestTripPlanCommand, RequestTripPlanResponse> =>
  async (command: RequestTripPlanCommand) => {
    const id = idGenerator.generateId();
    const tripPlan = TripPlan.request(new TripPlanId(id), {
      originCity: new OriginCity(command.originCity),
      destinationCity: new DestinationCity(command.destinationCity),
      requestedBy: new UserId(command.userId),
      date: new TripDateRange(command.date.start, command.date.end),
      travelers: command.travelers.map((traveler) =>
        Traveler.create(
          new TravelerId(idGenerator.generateId()),
          new TravelerName(traveler.name),
        ),
      ),
      tripBudget: new TripBudget(
        command.budget.amount,
        command.budget.currency,
      ),
    });
    await eventStore.appendEventsFrom(tripPlan);
    return Result.success({
      id,
    });
  };
