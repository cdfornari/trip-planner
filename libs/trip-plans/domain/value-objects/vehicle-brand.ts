import { ValueObject } from 'libs/core/domain/value-object';

export class VehicleBrand implements ValueObject<VehicleBrand> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_VEHICLE_BRAND');
  }

  get value(): string {
    return this._value;
  }

  equals(other: VehicleBrand): boolean {
    return this._value === other.value;
  }
}
