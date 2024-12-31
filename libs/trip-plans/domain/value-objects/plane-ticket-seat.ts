import { ValueObject } from 'libs/core/domain/value-object';

export class PlaneTicketSeat implements ValueObject<PlaneTicketSeat> {
  constructor(
    private readonly _row: number,
    private readonly _seat: string,
  ) {
    if (_row < 0 || _seat.length !== 1)
      throw new Error('INVALID_PLANE_TICKET_SEAT');
  }

  get value(): string {
    return `${this._row}-${this._seat}`;
  }

  equals(other: PlaneTicketSeat): boolean {
    return (
      this._row === other._row && this._seat === other._seat
    );
  }
}
