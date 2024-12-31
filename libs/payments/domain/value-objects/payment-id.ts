import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';

export class PaymentId implements ValueObject<PaymentId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value)) throw new Error('INVALID_PAYMENT_ID');
  }

  get value(): string {
    return this._value;
  }

  equals(other: PaymentId): boolean {
    return this._value === other.value;
  }
}
