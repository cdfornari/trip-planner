import { ValueObject } from 'libs/core/domain/value-object';

export class VehicleCapacity implements ValueObject<VehicleCapacity> {
  constructor(private readonly _value: number) {
    if (_value < 1) throw new Error('INVALID_VEHICLE_CAPACITY');
  }

  get value(): number {
    return this._value;
  }

  equals(other: VehicleCapacity): boolean {
    return this._value === other.value;
  }
}
