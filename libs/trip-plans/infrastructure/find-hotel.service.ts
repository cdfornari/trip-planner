import { IdGenerator } from 'libs/core/application/id-generator';
import { TripPlan } from '../domain/trip-plan';
import { PriceDetail } from '../domain/value-objects/price-detail';
import {
  generateRandomNumber,
  probability,
  selectRandom,
} from 'libs/core/utils/random';
import { FindHotelService } from '../domain/services/find-hotel.service';
import { HotelBooking } from '../domain/entities/hotel-booking';
import { HotelBookingId } from '../domain/value-objects/hotel-booking-id';
import { HotelName } from '../domain/value-objects/hotel-name';
import { HotelStars } from '../domain/value-objects/hotel-stars';
import { HotelAddress } from '../domain/value-objects/hotel-address';
import { HotelBookingRoom } from '../domain/value-objects/hotel-booking-room';

type Hotel = {
  name: string;
  stars: number;
  address: string;
};

const hotels: Hotel[] = [
  { name: 'Marriott', stars: 5, address: '1234 Marriott St' },
  { name: 'Hilton', stars: 4, address: '1234 Hilton St' },
  { name: 'Holiday Inn', stars: 3, address: '1234 Holiday Inn St' },
  { name: 'Motel 6', stars: 2, address: '1234 Motel 6 St' },
  { name: 'Motel X', stars: 1, address: '1234 Airbnb St' },
  { name: 'Eurobuilding', stars: 5, address: '1234 Ritz Carlton St' },
  { name: 'Four Seasons', stars: 3, address: '1234 Four Seasons St' },
  { name: 'Sheraton', stars: 4, address: '1234 Sheraton St' },
  { name: 'Westin', stars: 3, address: '1234 Westin St' },
];

export const FindHotelServiceSimulation =
  (idGenerator: IdGenerator<string>): FindHotelService =>
  async (tripPlan: TripPlan) => {
    if (probability(10)) throw new Error('HOTEL_NOT_FOUND');
    if (tripPlan.availableBudget < 10) throw new Error('INSUFFICIENT_BUDGET');
    const affordableHotels: Hotel[] = hotels.filter(
      (hotel) =>
        hotel.stars * 10 * tripPlan.durationDays <= tripPlan.availableBudget,
    );
    if (affordableHotels.length === 0) throw new Error('HOTEL_NOT_FOUND');
    const hotel = selectRandom(affordableHotels);
    const pricePerDay = 10 * hotel.stars;
    const price = pricePerDay * tripPlan.durationDays;
    return HotelBooking.create(
      new HotelBookingId(idGenerator.generateId()),
      new HotelName(hotel.name),
      new HotelStars(hotel.stars),
      new HotelAddress(hotel.address),
      new HotelBookingRoom(
        generateRandomNumber(1, 10),
        generateRandomNumber(1, 70),
      ),
      new PriceDetail(price, '$'),
    );
  };
