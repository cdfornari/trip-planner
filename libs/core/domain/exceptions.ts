export abstract class DomainException {
  static throw() {
    throw new Error(this.prototype.constructor.name);
  }
}
