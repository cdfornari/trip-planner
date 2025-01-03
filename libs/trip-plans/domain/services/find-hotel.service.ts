import { DomainService } from 'libs/core/domain/services';
import { TripPlan } from '../trip-plan';
import { HotelBooking } from '../entities/hotel-booking';

export type FindHotelService = DomainService<
  TripPlan,
  Promise<HotelBooking>
>;
