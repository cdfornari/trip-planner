import { ValueObject } from 'libs/core/domain/value-object';

enum PaymentMethodEnum {
  WALLET = 'WALLET',
}

export class PaymentMethod implements ValueObject<PaymentMethod> {
  constructor(_value: string) {
    try {
      this._value = PaymentMethodEnum[_value];
    } catch (error) {
      throw new Error('INVALID_PAYMENT_METHOD');
    }
  }

  private _value: PaymentMethodEnum;

  get value(): PaymentMethodEnum {
    return this._value;
  }

  equals(other: PaymentMethod): boolean {
    return this._value === other.value;
  }
}
