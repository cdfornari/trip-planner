import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';

export class PlaneTicketId implements ValueObject<PlaneTicketId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value)) throw new Error('INVALID_PLANE_TICKET_ID');
  }

  get value(): string {
    return this._value;
  }

  equals(other: PlaneTicketId): boolean {
    return this._value === other.value;
  }
}
