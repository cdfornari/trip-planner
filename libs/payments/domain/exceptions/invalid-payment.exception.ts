import { DomainException } from 'libs/core/domain/exceptions';

export class InvalidPaymentException extends DomainException {
  constructor() {
    super();
  }
}
