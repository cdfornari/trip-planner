import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { TripPlan } from '../trip-plan';
import { HotelBooking } from '../entities/hotel-booking';

export type HotelBookedEvent = DomainEvent<HotelBooked>;

export class HotelBooked {
  private constructor() {}
  id: string;
  hotelName: string;
  hotelStars: number;
  hotelAddress: string;
  bookedRoom: string;
  price: {
    currency: string;
    amount: number;
  };

  static createEvent(
    dispatcher: TripPlan,
    booking: HotelBooking,
  ): HotelBookedEvent {
    return DomainEventFactory<HotelBooked>({
      dispatcher,
      name: HotelBooked.name,
      context: {
        id: booking.id.value,
        hotelName: booking.hotelName.value,
        hotelStars: booking.hotelStars.value,
        hotelAddress: booking.hotelAddress.value,
        bookedRoom: booking.bookedRoom.value,
        price: {
          currency: booking.price.currency,
          amount: booking.price.value,
        },
      },
    });
  }
}
