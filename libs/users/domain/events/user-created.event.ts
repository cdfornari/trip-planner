import { DomainEvent, DomainEventFactory } from 'libs/core/domain/events';
import { User } from '../user';
import { UserName } from '../value-objects/user-name';
import { UserEmail } from '../value-objects/user-email';
import { UserWallet } from '../value-objects/user-wallet';

export type UserCreatedEvent = DomainEvent<UserCreated>;

export class UserCreated {
  private constructor() {}
  name: string;
  email: string;
  wallet: string;

  static createEvent(
    dispatcher: User,
    userName: UserName,
    userEmail: UserEmail,
    wallet: UserWallet,
  ): UserCreatedEvent {
    return DomainEventFactory<UserCreated>({
      dispatcher,
      name: UserCreated.name,
      context: {
        name: userName.value,
        email: userEmail.value,
        wallet: wallet.value,
      },
    });
  }
}
