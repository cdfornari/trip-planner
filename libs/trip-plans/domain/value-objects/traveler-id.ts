import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';

export class TravelerId implements ValueObject<TravelerId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value)) throw new Error('INVALID_TRAVELER_ID');
  }

  get value(): string {
    return this._value;
  }

  equals(other: TravelerId): boolean {
    return this._value === other.value;
  }
}
