import { Module } from '@nestjs/common';
import { EventStoreModule } from 'libs/core/infrastructure/event-store/event-store.module';
import { Environment } from 'libs/core/utils/environment';
import { BillingListener } from './billing.listener';

@Module({
  imports: [
    EventStoreModule.forRoot({
      host: Environment.eventStore.host,
      port: Environment.eventStore.port,
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [BillingListener],
})
export class BillingModule {}
