import { ValueObject } from 'libs/core/domain/value-object';

export class ActivityDuration implements ValueObject<ActivityDuration> {
  constructor(
    private readonly _hours: number,
    private readonly _minutes: number,
  ) {
    if (_hours < 0 || _hours > 12 || _minutes < 0 || _minutes > 59)
      throw new Error('INVALID_ACTIVITY_DURATION');
  }

  get hours(): number {
    return this._hours;
  }

  get minutes(): number {
    return this._minutes;
  }

  equals(other: ActivityDuration): boolean {
    return this._hours === other.hours && this._minutes === other.minutes;
  }
}
