import { AggregateRoot } from 'libs/core/domain/aggregate-root';
import { UserId } from './value-objects/user-id';
import { UserName } from './value-objects/user-name';
import { UserEmail } from './value-objects/user-email';
import { InvalidUserException } from './exceptions/invalid-user.exception';
import { UserCreated } from './events/user-created.event';
import { DomainEvent } from 'libs/core/domain/events';
import { UserWallet } from './value-objects/user-wallet';

export class User extends AggregateRoot<UserId> {
  private constructor(protected readonly _id: UserId) {
    super(_id);
  }

  protected validateState(): void {
    if (!this.id || !this._email || !this._name || !this._wallet) {
      throw new InvalidUserException();
    }
  }

  private _name: UserName;
  private _email: UserEmail;
  private _wallet: UserWallet;

  get id(): UserId {
    return this._id;
  }

  get uid(): string {
    return this._id.value;
  }

  get name(): UserName {
    return this._name;
  }

  get email(): UserEmail {
    return this._email;
  }

  get wallet(): UserWallet {
    return this._wallet;
  }

  static create(
    id: UserId,
    data: {
      name: UserName;
      email: UserEmail;
      wallet: UserWallet;
    },
  ): User {
    const user = new User(id);
    user.apply(
      UserCreated.createEvent(user, data.name, data.email, data.wallet),
    );
    return user;
  }

  static loadFromHistory(id: UserId, events: DomainEvent[]): User {
    const user = new User(id);
    user.hydrate(events);
    return user;
  }

  [`on${UserCreated.name}`](context: UserCreated): void {
    this._name = new UserName(context.name);
    this._email = new UserEmail(context.email);
    this._wallet = new UserWallet(context.wallet);
  }
}
