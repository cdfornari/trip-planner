import { ValueObject } from 'libs/core/domain/value-object';

export class VehicleYear implements ValueObject<VehicleYear> {
  constructor(private readonly _value: number) {
    if (_value < 1920) throw new Error('INVALID_VEHICLE_YEAR');
  }

  get value(): number {
    return this._value;
  }

  equals(other: VehicleYear): boolean {
    return this._value === other.value;
  }
}
