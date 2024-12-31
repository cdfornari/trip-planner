import { ValueObject } from 'libs/core/domain/value-object';

export enum TripPlanStatusEnum {
  PLAN_REQUESTED = 'PLAN_REQUESTED',
  PLANNING = 'PLANNING',
  PLAN_COMPLETED = 'PLAN_COMPLETED',
  PLAN_FAILED = 'PLAN_FAILED',
}

export class TripPlanStatus implements ValueObject<TripPlanStatus> {
  protected constructor(private readonly _value: TripPlanStatusEnum) {
    if (!Object.values(TripPlanStatusEnum).includes(_value))
      throw new Error('INVALID_TRIP_STATUS');
  }

  get isPlanRequested(): boolean {
    return this._value === TripPlanStatusEnum.PLAN_REQUESTED;
  }

  get isPlanning(): boolean {
    return this._value === TripPlanStatusEnum.PLANNING;
  }

  get isPlanCompleted(): boolean {
    return this._value === TripPlanStatusEnum.PLAN_COMPLETED;
  }

  get isPlanFailed(): boolean {
    return this._value === TripPlanStatusEnum.PLAN_FAILED;
  }

  equals(other: TripPlanStatus): boolean {
    return this._value === other._value;
  }

  static PlanRequested(): TripPlanStatus {
    return new TripPlanStatus(TripPlanStatusEnum.PLAN_REQUESTED);
  }

  static Planning(): TripPlanStatus {
    return new TripPlanStatus(TripPlanStatusEnum.PLANNING);
  }

  static PlanCompleted(): TripPlanStatus {
    return new TripPlanStatus(TripPlanStatusEnum.PLAN_COMPLETED);
  }

  static PlanFailed(): TripPlanStatus {
    return new TripPlanStatus(TripPlanStatusEnum.PLAN_FAILED);
  }
}
