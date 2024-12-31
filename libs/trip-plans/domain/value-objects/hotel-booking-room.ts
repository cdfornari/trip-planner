import { ValueObject } from 'libs/core/domain/value-object';

export class HotelBookingRoom implements ValueObject<HotelBookingRoom> {
  constructor(
    private readonly _floor: number,
    private readonly _roomNumber: number,
  ) {
    if (_floor < 0 || _roomNumber < 1)
      throw new Error('INVALID_HOTEL_BOOKING_ROOM');
  }

  get value(): string {
    return `${this._floor === 0 ? 'PB' : this._floor}-${this._roomNumber}`;
  }

  equals(other: HotelBookingRoom): boolean {
    return (
      this._floor === other._floor && this._roomNumber === other._roomNumber
    );
  }
}
