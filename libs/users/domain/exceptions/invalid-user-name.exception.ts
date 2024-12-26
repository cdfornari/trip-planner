import { DomainException } from 'libs/core/domain/exceptions';

export class InvalidUserNameException extends DomainException {
  constructor() {
    super();
  }
}
