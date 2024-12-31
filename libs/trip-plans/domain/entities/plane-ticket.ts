import { Entity } from 'libs/core/domain/entity';
import { PlaneTicketId } from '../value-objects/plane-ticket-id';
import { PlaneTicketSeat } from '../value-objects/plane-ticket-seat';
import { TravelerId } from '../value-objects/traveler-id';
import { PriceDetail } from '../value-objects/price-detail';

export class PlaneTicket extends Entity<PlaneTicketId> {
  private constructor(
    protected readonly _id: PlaneTicketId,
    protected _seat: PlaneTicketSeat,
    protected _passenger: TravelerId,
    protected _price: PriceDetail,
  ) {
    super(_id);
  }

  get id(): PlaneTicketId {
    return this._id;
  }

  get seat(): PlaneTicketSeat {
    return this.seat;
  }

  get passenger(): TravelerId {
    return this.passenger;
  }

  get price(): PriceDetail {
    return this.price;
  }

  static create(
    id: PlaneTicketId,
    seat: PlaneTicketSeat,
    passenger: TravelerId,
    price: PriceDetail,
  ): PlaneTicket {
    return new PlaneTicket(id, seat, passenger, price);
  }
}
