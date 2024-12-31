import { Entity } from 'libs/core/domain/entity';
import { HotelBookingId } from '../value-objects/hotel-booking-id';
import { HotelName } from '../value-objects/hotel-name';
import { HotelAddress } from '../value-objects/hotel-address';
import { HotelBookingRoom } from '../value-objects/hotel-booking-room';
import { HotelStars } from '../value-objects/hotel-stars';
import { PriceDetail } from '../value-objects/price-detail';

export class HotelBooking extends Entity<HotelBookingId> {
  private constructor(
    protected readonly _id: HotelBookingId,
    protected _hotelName: HotelName,
    protected _hotelStars: HotelStars,
    protected _hotelAddress: HotelAddress,
    protected _bookedRoom: HotelBookingRoom,
    protected _price: PriceDetail,
  ) {
    super(_id);
  }

  get id(): HotelBookingId {
    return this._id;
  }

  get hotelName(): HotelName {
    return this._hotelName;
  }

  get hotelStars(): HotelStars {
    return this._hotelStars;
  }

  get hotelAddress(): HotelAddress {
    return this._hotelAddress;
  }

  get bookedRoom(): HotelBookingRoom {
    return this._bookedRoom;
  }

  get price(): PriceDetail {
    return this._price;
  }

  static create(
    id: HotelBookingId,
    hotelName: HotelName,
    hotelStars: HotelStars,
    hotelAddress: HotelAddress,
    bookedRoom: HotelBookingRoom,
    price: PriceDetail,
  ): HotelBooking {
    return new HotelBooking(
      id,
      hotelName,
      hotelStars,
      hotelAddress,
      bookedRoom,
      price,
    );
  }
}
