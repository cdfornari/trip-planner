import { ValueObject } from 'libs/core/domain/value-object';

export class PaymentAmount implements ValueObject<PaymentAmount> {
  constructor(private readonly _value: number) {
    if (_value <= 0) throw new Error('INVALID_PAYMENT_AMOUNT');
  }

  get value(): number {
    return this._value;
  }

  equals(other: PaymentAmount): boolean {
    return this._value === other.value;
  }
}
