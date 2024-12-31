import { ValueObject } from 'libs/core/domain/value-object';

export class TripDateRange implements ValueObject<TripDateRange> {
  constructor(
    private readonly _start: Date,
    private readonly _end: Date,
  ) {
    if (
      //_start < new Date() || _end < new Date() ||
      _start > _end
    )
      throw new Error('INVALID_TRIP_DATE_RANGE');
  }

  get start(): Date {
    return this._start;
  }

  get end(): Date {
    return this._end;
  }

  contains(date: Date): boolean {
    return date >= this._start && date <= this._end;
  }

  equals(other: TripDateRange): boolean {
    return this._start === other.start && this._end === other.end;
  }
}
