import { DomainException } from 'libs/core/domain/exceptions';

export class InvalidUserIdException extends DomainException {
  constructor() {
    super();
  }
}
