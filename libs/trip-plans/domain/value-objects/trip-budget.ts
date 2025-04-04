import { ValueObject } from 'libs/core/domain/value-object';

enum Currency {
  USD = '$',
}

export class TripBudget implements ValueObject<TripBudget> {
  constructor(
    private readonly _limit: number,
    _currency: string,
  ) {
    if (_limit < 300) throw new Error('INVALID_TRIP_BUDGET');
    this._currency = Currency[_currency];
    if (!this._currency) throw new Error('INVALID_TRIP_BUDGET');
  }

  private readonly _currency: Currency;

  get limit(): number {
    return this._limit;
  }

  get currency(): Currency {
    return this._currency;
  }

  equals(other: TripBudget): boolean {
    return this._limit === other.limit && this._currency === other.currency;
  }
}
