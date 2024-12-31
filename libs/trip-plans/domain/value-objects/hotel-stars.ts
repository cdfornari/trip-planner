import { ValueObject } from 'libs/core/domain/value-object';

export class HotelStars implements ValueObject<HotelStars> {
  constructor(private readonly _value: number) {
    if (_value < 1 || _value > 5) throw new Error('INVALID_HOTEL_STARS');
  }

  get value(): number {
    return this._value;
  }

  equals(other: HotelStars): boolean {
    return this._value === other.value;
  }
}
