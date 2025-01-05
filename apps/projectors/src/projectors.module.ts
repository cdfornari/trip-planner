import { Module } from '@nestjs/common';
import { SureealDbProjector } from './surrealdb-projector';
import { EventStoreModule } from 'libs/core/infrastructure/event-store/event-store.module';
import { Environment } from 'libs/core/utils/environment';
import { SurrealModule } from 'libs/core/infrastructure/surrealdb/surrealdb.module';

@Module({
  imports: [
    EventStoreModule.forRoot({
      host: Environment.eventStore.host,
      port: Environment.eventStore.port,
      isGlobal: true,
    }),
    SurrealModule.forRoot({
      host: Environment.surrealDb.host,
      port: Environment.surrealDb.port,
      password: Environment.surrealDb.password,
      username: Environment.surrealDb.user,
      database: Environment.surrealDb.database,
      namespace: Environment.surrealDb.namespace,
    }),
  ],
  controllers: [],
  providers: [SureealDbProjector],
})
export class ProjectorsModule {}
