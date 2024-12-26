import { DomainException } from 'libs/core/domain/exceptions';

export class InvalidUserEmailException extends DomainException {
  constructor() {
    super();
  }
}
