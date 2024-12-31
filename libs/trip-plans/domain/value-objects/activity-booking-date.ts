import { ValueObject } from 'libs/core/domain/value-object';

export class ActivityBookingDate implements ValueObject<ActivityBookingDate> {
  constructor(private readonly _value: Date) {
    //if (_value < new Date()) throw new Error('INVALID_ACTIVITY_BOOKING_DATE');
  }

  get value(): Date {
    return this._value;
  }

  equals(other: ActivityBookingDate): boolean {
    return this._value === other.value;
  }
}
