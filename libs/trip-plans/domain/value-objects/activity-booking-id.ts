import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';

export class ActivityBookingId implements ValueObject<ActivityBookingId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value))
      throw new Error('INVALID_ACTIVITY_BOOKING_ID');
  }

  get value(): string {
    return this._value;
  }

  equals(userId: ActivityBookingId): boolean {
    return this._value === userId.value;
  }
}
