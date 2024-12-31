import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';

export class TripPlanId implements ValueObject<TripPlanId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value)) throw new Error('INVALID_TRIP_ID');
  }

  get value(): string {
    return this._value;
  }

  equals(other: TripPlanId): boolean {
    return this._value === other.value;
  }
}
