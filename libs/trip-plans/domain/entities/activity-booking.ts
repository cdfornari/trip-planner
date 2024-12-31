import { Entity } from 'libs/core/domain/entity';
import { ActivityBookingId } from '../value-objects/activity-booking-id';
import { ActivityDescription } from '../value-objects/activity-description';
import { ActivityBookingDate } from '../value-objects/activity-booking-date';
import { ActivityDuration } from '../value-objects/activity-duration';
import { PriceDetail } from '../value-objects/price-detail';

export class ActivityBooking extends Entity<ActivityBookingId> {
  private constructor(
    protected readonly _id: ActivityBookingId,
    protected _description: ActivityDescription,
    protected _date: ActivityBookingDate,
    protected _duration: ActivityDuration,
    protected _price: PriceDetail,
  ) {
    super(_id);
  }

  get id(): ActivityBookingId {
    return this._id;
  }

  get description(): ActivityDescription {
    return this._description;
  }

  get date(): ActivityBookingDate {
    return this._date;
  }

  get duration(): ActivityDuration {
    return this._duration;
  }

  get price(): PriceDetail {
    return this._price;
  }

  static create(
    id: ActivityBookingId,
    description: ActivityDescription,
    date: ActivityBookingDate,
    duration: ActivityDuration,
    price: PriceDetail,
  ): ActivityBooking {
    return new ActivityBooking(id, description, date, duration, price);
  }
}
