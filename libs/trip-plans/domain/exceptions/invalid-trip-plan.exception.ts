import { DomainException } from 'libs/core/domain/exceptions';

export class InvalidTripPlanException extends DomainException {
  constructor() {
    super();
  }
}
