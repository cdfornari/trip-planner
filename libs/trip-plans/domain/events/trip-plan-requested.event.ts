import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';
import { OriginCity } from '../value-objects/origin-city';
import { DestinationCity } from '../value-objects/destination-city';
import { TripBudget } from '../value-objects/trip-budget';
import { TripDateRange } from '../value-objects/trip-date-range';
import { Traveler } from '../entities/traveler';
import { UserId } from 'libs/users/domain/value-objects/user-id';

export type TripPlanRequestedEvent = DomainEvent<TripPlanRequested>;

export class TripPlanRequested {
  private constructor() {}
  requestedBy: string;
  originCity: string;
  destinationCity: string;
  budget: {
    currency: string;
    limit: number;
  };
  date: {
    start: Date;
    end: Date;
  };
  travelers: {
    id: string;
    name: string;
  }[];

  static createEvent(
    dispatcher: TripPlan,
    data: {
      requestedBy: UserId;
      originCity: OriginCity;
      destinationCity: DestinationCity;
      tripBudget: TripBudget;
      date: TripDateRange;
      travelers: Traveler[];
    },
  ): TripPlanRequestedEvent {
    return DomainEventFactory<TripPlanRequested>({
      dispatcher,
      name: TripPlanRequested.name,
      context: {
        requestedBy: data.requestedBy.value,
        originCity: data.originCity.value,
        destinationCity: data.destinationCity.value,
        budget: {
          currency: data.tripBudget.currency.valueOf(),
          limit: data.tripBudget.limit,
        },
        date: {
          start: data.date.start,
          end: data.date.end,
        },
        travelers: data.travelers.map((traveler) => ({
          id: traveler.id.value,
          name: traveler.name.value,
        })),
      },
    });
  }
}
