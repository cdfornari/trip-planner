import { ValueObject } from 'libs/core/domain/value-object';

enum Currency {
  USD = 'USD',
}

export class PriceDetail implements ValueObject<PriceDetail> {
  constructor(
    private readonly _value: number,
    _currency: string,
  ) {
    if (_value <= 0) throw new Error('INVALID_PRICE_DETAIL');
    try {
      this._currency = Currency[_currency];
    } catch (e) {
      throw new Error('INVALID_PRICE_DETAIL');
    }
  }

  private readonly _currency: Currency;

  get value(): number {
    return this._value;
  }

  get currency(): Currency {
    return this._currency;
  }

  equals(other: PriceDetail): boolean {
    return this._value === other.value && this._currency === other.currency;
  }
}
