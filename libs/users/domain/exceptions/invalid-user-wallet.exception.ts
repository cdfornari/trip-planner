import { DomainException } from 'libs/core/domain/exceptions';

export class InvalidUserWalletException extends DomainException {
  constructor() {
    super();
  }
}
