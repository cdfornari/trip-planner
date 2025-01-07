import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { SAGA_KEY } from './saga-step.decorator';
import { SUBSCRIPTION_KEY } from './subscribe-to-group.decorator';
import { EventStoreService } from './event-store.service';
import { PROJECTOR_KEY } from './projector.decorator';
import { DomainEvent } from 'libs/core/domain/events';

@Injectable()
export class SubscriptionInit implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
    private readonly eventStore: EventStoreService,
  ) {}

  async onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    await Promise.all(
      providers.map(async (wrapper) => {
        // console.log(wrapper.token);
        const { instance } = wrapper;
        const prototype = instance && Object.getPrototypeOf(instance);
        if (!instance || !prototype) return;
        const isSaga =
          this.reflector.get<boolean>(SAGA_KEY, instance.constructor) ?? false;
        const isProjector =
          this.reflector.get<boolean>(PROJECTOR_KEY, instance.constructor) ??
          false;
        if (!isSaga && !isProjector) return;
        const methodKeys = this.metadataScanner.getAllMethodNames(prototype);
        await Promise.all(
          methodKeys.map(async (methodKey) => {
            const listener =
              this.reflector.get(SUBSCRIPTION_KEY, instance[methodKey]) ??
              false;
            if (listener) {
              const { eventType, groupName } = JSON.parse(listener);
              await this.eventStore.createSubscriptionGroup(
                eventType,
                groupName,
              );
              await this.eventStore.subscribeToGroup(
                groupName,
                (
                  event: DomainEvent,
                  ack: () => Promise<void>,
                  nack: (error: any) => Promise<void>,
                ) => instance[methodKey](event, ack, nack),
              );
            }
          }),
        );
      }),
    );
  }
}
