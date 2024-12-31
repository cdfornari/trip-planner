import { Injectable } from '@nestjs/common';
import { EventStore } from 'libs/core/application/event-store';
import { DomainEvent } from 'libs/core/domain/events';
import { InjectEventStore } from './inject-event-store.decorator';
import {
  EventStoreDBClient,
  eventTypeFilter,
  jsonEvent,
  JSONType,
  NO_STREAM,
  persistentSubscriptionToAllSettingsFromDefaults,
  RETRY,
} from '@eventstore/db-client';
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
    const expectedRevision =
      dispatcher.version - events.length === 0
        ? NO_STREAM
        : BigInt(dispatcher.version - events.length);
    await this.client.appendToStream(dispatcher.uid, serializedEvents, {
      expectedRevision,
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

  async createSubscriptionGroup(
    eventType: string,
    groupName: string,
  ): Promise<void> {
    await this.client.createPersistentSubscriptionToAll(
      groupName,
      persistentSubscriptionToAllSettingsFromDefaults(),
      {
        filter: eventTypeFilter({ prefixes: [eventType] }),
      },
    );
  }

  async subscribeToGroup(
    groupName: string,
    onEvent: (
      event: DomainEvent,
      ack: () => Promise<void>,
      nack: (error: any) => Promise<void>,
    ) => Promise<void>,
  ): Promise<void> {
    const subscription =
      this.client.subscribeToPersistentSubscriptionToAll(groupName);
    for await (const resolvedEvent of subscription) {
      const context = JSON.parse(
        (resolvedEvent.event.data as JSONType).toString(),
      );
      try {
        console.log(
          `handling event ${resolvedEvent.event?.type} with retryCount ${resolvedEvent.retryCount}`,
        );
        await onEvent(
          {
            dispatcherId: resolvedEvent.event.streamId,
            name: resolvedEvent.event.type,
            context,
            timestamp: JSON.parse(resolvedEvent.event.metadata.toString())
              .timestamp,
            position: Number(resolvedEvent.event.revision),
          },
          async () => {
            await subscription.ack(resolvedEvent);
          },
          async (error) => {
            await subscription.nack(RETRY, error.toString(), resolvedEvent);
          },
        );
        //await subscription.ack(resolvedEvent);
      } catch (error) {
        await subscription.nack(RETRY, error.toString(), resolvedEvent);
      }
    }
  }
}
