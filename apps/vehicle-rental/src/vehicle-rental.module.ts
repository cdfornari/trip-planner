import { Module } from '@nestjs/common';
import { VehicleRentalListener } from './vehicle-rental.listener';
import { EventStoreModule } from 'libs/core/infrastructure/event-store/event-store.module';
import { Environment } from 'libs/core/utils/environment';

@Module({
  imports: [
    EventStoreModule.forRoot({
      host: Environment.eventStore.host,
      port: Environment.eventStore.port,
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [VehicleRentalListener],
})
export class VehicleRentalModule {}
