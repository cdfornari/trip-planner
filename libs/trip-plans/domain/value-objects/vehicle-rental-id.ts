import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';

export class VehicleRentalId implements ValueObject<VehicleRentalId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value)) throw new Error('INVALID_VEHICLE_RENTAL_ID');
  }

  get value(): string {
    return this._value;
  }

  equals(other: VehicleRentalId): boolean {
    return this._value === other.value;
  }
}
