import { ValueObject } from 'libs/core/domain/value-object';

export class TravelerName implements ValueObject<TravelerName> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_TRAVELER_NAME');
  }

  get value(): string {
    return this._value;
  }

  equals(other: TravelerName): boolean {
    return this._value === other.value;
  }
}
