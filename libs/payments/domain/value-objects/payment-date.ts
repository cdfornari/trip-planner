import { ValueObject } from 'libs/core/domain/value-object';

export class PaymentDate implements ValueObject<PaymentDate> {
  constructor(private readonly _value: Date) {
    if (_value > new Date()) throw new Error('INVALID_PAYMENT_DATE');
  }

  get value(): Date {
    return this._value;
  }

  equals(other: PaymentDate): boolean {
    return this._value === other.value;
  }
}
