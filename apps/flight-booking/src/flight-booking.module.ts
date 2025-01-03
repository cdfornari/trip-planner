import { Module } from '@nestjs/common';
import { FlightBookingListener } from './flight-booking.listener';
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
  providers: [FlightBookingListener],
})
export class FlightBookingModule {}
