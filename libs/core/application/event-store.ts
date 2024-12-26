import { AggregateRoot } from '../domain/aggregate-root';
import { DomainEvent } from '../domain/events';
import { ValueObject } from '../domain/value-object';

export interface EventStore {
  appendEventsFrom(
    dispatcher: AggregateRoot<ValueObject<any>>,
  ): Promise<DomainEvent[]>;
  getEventsByStream(stream: string): Promise<DomainEvent[]>;
}
