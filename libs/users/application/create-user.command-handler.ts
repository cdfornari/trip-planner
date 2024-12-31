import { EventStore } from 'libs/core/application/event-store';
import { IdGenerator } from 'libs/core/application/id-generator';
import { ApplicationService } from 'libs/core/application/service';
import { Result } from 'libs/core/utils/result';
import { User } from 'libs/users/domain/user';
import { UserEmail } from 'libs/users/domain/value-objects/user-email';
import { UserId } from 'libs/users/domain/value-objects/user-id';
import { UserName } from 'libs/users/domain/value-objects/user-name';
import { UserWallet } from '../domain/value-objects/user-wallet';

export type CreateUserCommand = {
  name: string;
  email: string;
  wallet: string;
};

export type CreateUserResponse = {
  id: string;
};

export const CreateUserCommandHandler =
  (
    eventStore: EventStore,
    idGenerator: IdGenerator<string>,
  ): ApplicationService<CreateUserCommand, CreateUserResponse> =>
  async (command: CreateUserCommand) => {
    const id = idGenerator.generateId();
    const data = {
      name: new UserName(command.name),
      email: new UserEmail(command.email),
      wallet: new UserWallet(command.wallet),
    };
    const user = User.create(new UserId(id), data);
    await eventStore.appendEventsFrom(user);
    return Result.success({
      id,
    });
  };
