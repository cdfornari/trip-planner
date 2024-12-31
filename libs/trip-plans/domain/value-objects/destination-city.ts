import { ValueObject } from 'libs/core/domain/value-object';

export class DestinationCity implements ValueObject<DestinationCity> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_DESTINATION_CITY');
  }

  get value(): string {
    return this._value;
  }

  equals(other: DestinationCity): boolean {
    return this._value === other.value;
  }
}
