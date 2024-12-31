import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';
import { ActivityBooking } from '../entities/activity-booking';

export type ActivityBookedEvent = DomainEvent<ActivityBooked>;

export class ActivityBooked {
  private constructor() {}
  id: string;
  description: string;
  date: Date;
  duration: {
    hours: number;
    minutes: number;
  };
  price: {
    currency: string;
    amount: number;
  };

  static createEvent(
    dispatcher: TripPlan,
    booking: ActivityBooking,
  ): ActivityBookedEvent {
    return DomainEventFactory<ActivityBooked>({
      dispatcher,
      name: ActivityBooked.name,
      context: {
        id: booking.id.value,
        description: booking.description.value,
        date: booking.date.value,
        duration: {
          hours: booking.duration.hours,
          minutes: booking.duration.minutes,
        },
        price: {
          amount: booking.price.value,
          currency: booking.price.currency,
        },
      },
    });
  }
}
