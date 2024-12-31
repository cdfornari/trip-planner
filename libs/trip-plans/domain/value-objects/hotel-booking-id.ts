import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';

export class HotelBookingId implements ValueObject<HotelBookingId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value)) throw new Error('INVALID_HOTEL_BOOKING_ID');
  }

  get value(): string {
    return this._value;
  }

  equals(other: HotelBookingId): boolean {
    return this._value === other.value;
  }
}
