import { ValueObject } from 'libs/core/domain/value-object';

export class HotelName implements ValueObject<HotelName> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_HOTEL_NAME');
  }

  get value(): string {
    return this._value;
  }

  equals(other: HotelName): boolean {
    return this._value === other.value;
  }
}
