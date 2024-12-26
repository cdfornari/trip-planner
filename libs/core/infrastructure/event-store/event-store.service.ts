import { Injectable } from '@nestjs/common';
import { EventStore } from 'libs/core/application/event-store';
import { DomainEvent } from 'libs/core/domain/events';
import { InjectEventStore } from './inject-event-store.decorator';
import { EventStoreDBClient, jsonEvent, JSONType } from '@eventstore/db-client';
import { AggregateRoot } from 'libs/core/domain/aggregate-root';
import { ValueObject } from 'libs/core/domain/value-object';

@Injectable()
export class EventStoreService implements EventStore {
  constructor(
    @InjectEventStore() private readonly client: EventStoreDBClient,
  ) {}

  async appendEventsFrom(
    dispatcher: AggregateRoot<ValueObject<any>>,
  ): Promise<DomainEvent[]> {
    const events = dispatcher.pullEvents();
    if (events.length === 0) throw new Error('No events to append');
    const serializedEvents = events.map((event) =>
      jsonEvent<{
        type: string;
        data: {
          [key: string]: any;
        };
        metadata?: { timestamp: string };
      }>({
        type: event.name,
        data: event.context,
        metadata: { timestamp: event.timestamp.toISOString() },
      }),
    );
    await this.client.appendToStream(dispatcher.uid, serializedEvents, {
      expectedRevision: BigInt(dispatcher.version - events.length),
    });
    return events;
  }

  async getEventsByStream(stream: string): Promise<DomainEvent[]> {
    const serializedEvents = this.client.readStream(stream);
    const events: DomainEvent[] = [];
    for await (const resolvedEvent of serializedEvents) {
      const context = JSON.parse(
        (resolvedEvent.event.data as JSONType).toString(),
      );
      events.push({
        dispatcherId: stream,
        name: resolvedEvent.event.type,
        context,
        timestamp: JSON.parse(resolvedEvent.event.metadata.toString())
          .timestamp,
        position: Number(resolvedEvent.event.revision),
      });
    }
    return events;
  }
}
