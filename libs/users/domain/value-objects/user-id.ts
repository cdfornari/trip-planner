import { ValueObject } from 'libs/core/domain/value-object';
import { UUIDRegExp } from 'libs/core/utils/uuid.regexp';
import { InvalidUserIdException } from '../exceptions/invalid-user-id.exception';

export class UserId implements ValueObject<UserId> {
  constructor(private readonly _value: string) {
    if (!UUIDRegExp.test(_value)) throw new InvalidUserIdException();
  }

  get value(): string {
    return this._value;
  }

  equals(userId: UserId): boolean {
    return this._value === userId.value;
  }
}
