import { ValueObject } from 'libs/core/domain/value-object';

export class VehiclePlate implements ValueObject<VehiclePlate> {
  constructor(private readonly _value: string) {
    if (!/^([A-Z]{3}-\d{4})$/.test(_value))
      throw new Error('INVALID_VEHICLE_PLATE');
  }

  get value(): string {
    return this._value;
  }

  equals(other: VehiclePlate): boolean {
    return this._value === other.value;
  }
}