import { ValueObject } from 'libs/core/domain/value-object';

export class ActivityDescription implements ValueObject<ActivityDescription> {
  constructor(private readonly _value: string) {
    if (_value.length < 3) throw new Error('INVALID_ACTIVITY_DESCRIPTION');
  }

  get value(): string {
    return this._value;
  }

  equals(other: ActivityDescription): boolean {
    return this._value === other.value;
  }
}
