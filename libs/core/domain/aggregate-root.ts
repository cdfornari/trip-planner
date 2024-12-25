import { Entity } from './entity';
import { DomainEvent } from './events';
import { ValueObject } from './value-object';

const VERSION = Symbol('version');

export abstract class AggregateRoot<
  T extends ValueObject<T>,
> extends Entity<T> {
  private events: DomainEvent[] = [];

  protected constructor(id: T) {
    super(id);
  }

  abstract get uid(): string;

  private [VERSION] = 0;

  get version(): number {
    return this[VERSION];
  }

  protected abstract validateState(): void;

  pullEvents(): DomainEvent[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  protected hydrate(history: DomainEvent[]): void {
    if (history.length === 0) throw new Error('No events to replay');
    history.forEach((event) => this.apply(event, true));
  }

  protected apply(event: DomainEvent, fromHistory: boolean = false): void {
    const handler = this.getEventHandler(event);
    if (!handler) throw new Error(`No handler for event: ${event.name}`);
    if (!fromHistory) this.events.push(event);
    handler.call(this, event.context);
    this.validateState();
    this[VERSION]++;
  }

  protected getEventHandler(event: DomainEvent): Function | undefined {
    const handler = `on${event.name}`;
    return this[handler];
  }
}
