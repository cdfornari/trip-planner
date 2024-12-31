import {
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { SAGA_KEY } from './saga-step.decorator';
import { SUBSCRIPTION_KEY } from './subscribe-to-group.decorator';
import { EventStoreService } from './event-store.service';

@Injectable()
export class SubscriptionInit implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
    private readonly eventStore: EventStoreService,
  ) {}

  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper) => {
      // console.log(wrapper.token);
      const { instance } = wrapper;
      const prototype = instance && Object.getPrototypeOf(instance);
      if (!instance || !prototype) return;
      const isSaga =
        this.reflector.get<boolean>(SAGA_KEY, instance.constructor) ?? false;
      if (!isSaga) return;
      const methodKeys = this.metadataScanner.getAllMethodNames(prototype);
      methodKeys.forEach((methodKey) => {
        const listener =
          this.reflector.get(SUBSCRIPTION_KEY, instance[methodKey]) ?? false;
        if (listener)
          this.eventStore.subscribeToGroup(listener, instance[methodKey]);
      });
    });
  }
}
