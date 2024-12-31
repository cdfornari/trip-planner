import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';
import { PlaneTicket } from '../entities/plane-ticket';

export type FlightsBookedEvent = DomainEvent<FlightsBooked>;

export class FlightsBooked {
  private constructor() {}
  tickets: {
    id: string;
    seat: string;
    passengerId: string;
    price: {
      currency: string;
      amount: number;
    };
  }[];

  static createEvent(
    dispatcher: TripPlan,
    tickets: PlaneTicket[],
  ): FlightsBookedEvent {
    return DomainEventFactory<FlightsBooked>({
      dispatcher,
      name: FlightsBooked.name,
      context: {
        tickets: tickets.map((ticket) => ({
          id: ticket.id.value,
          seat: ticket.seat.value,
          passengerId: ticket.passenger.value,
          price: {
            currency: ticket.price.currency,
            amount: ticket.price.value,
          },
        })),
      },
    });
  }
}
