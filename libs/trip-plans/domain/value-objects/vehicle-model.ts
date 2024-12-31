import { ValueObject } from 'libs/core/domain/value-object';

export class VehicleModel implements ValueObject<VehicleModel> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_VEHICLE_MODEL');
  }

  get value(): string {
    return this._value;
  }

  equals(other: VehicleModel): boolean {
    return this._value === other.value;
  }
}
