import { AggregateRoot } from './aggregate-root';
import { ValueObject } from './value-object';

export interface DomainEvent<T extends object = object> {
  readonly dispatcherId: string;
  readonly name: string;
  readonly timestamp: Date;
  readonly position: number;
  readonly context: T;
}

export const DomainEventFactory = <T extends object>({
  name,
  dispatcher,
  context,
}: Omit<DomainEvent<T>, 'timestamp' | 'dispatcherId' | 'position'> & {
  dispatcher: AggregateRoot<ValueObject<any>>;
}): DomainEvent<T> => ({
  dispatcherId: dispatcher.uid,
  name,
  timestamp: new Date(),
  position: dispatcher.version + 1,
  context,
});
