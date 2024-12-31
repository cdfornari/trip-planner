import { ValueObject } from 'libs/core/domain/value-object';

export class HotelAddress implements ValueObject<HotelAddress> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_HOTEL_ADDRESS');
  }

  get value(): string {
    return this._value;
  }

  equals(other: HotelAddress): boolean {
    return this._value === other.value;
  }
}
