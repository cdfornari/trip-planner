import { Entity } from 'libs/core/domain/entity';
import { TravelerId } from '../value-objects/traveler-id';
import { TravelerName } from '../value-objects/traveler-name';

export class Traveler extends Entity<TravelerId> {
  private constructor(
    protected readonly _id: TravelerId,
    private _name: TravelerName,
  ) {
    super(_id);
  }

  get id(): TravelerId {
    return this._id;
  }

  get name(): TravelerName {
    return this._name;
  }

  static create(id: TravelerId, name: TravelerName): Traveler {
    return new Traveler(id, name);
  }
}
