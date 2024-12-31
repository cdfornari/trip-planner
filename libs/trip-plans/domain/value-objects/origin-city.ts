import { ValueObject } from 'libs/core/domain/value-object';

export class OriginCity implements ValueObject<OriginCity> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_ORIGIN_CITY');
  }

  get value(): string {
    return this._value;
  }

  equals(other: OriginCity): boolean {
    return this._value === other.value;
  }
}
