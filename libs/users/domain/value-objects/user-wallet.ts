import { ValueObject } from 'libs/core/domain/value-object';
import { InvalidUserWalletException } from '../exceptions/invalid-user-wallet.exception';

export class UserWallet implements ValueObject<UserWallet> {
  constructor(private readonly _value: string) {
    if (
      !new RegExp(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/g).test(_value) &&
      !new RegExp(/^0x[a-fA-F0-9]{40}$/g).test(_value)
    )
      throw new InvalidUserWalletException();
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserWallet): boolean {
    return this._value === other._value;
  }
}
