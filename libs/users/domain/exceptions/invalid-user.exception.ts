import { DomainException } from 'libs/core/domain/exceptions';

export class InvalidUserException extends DomainException {
  constructor() {
    super();
  }
}
