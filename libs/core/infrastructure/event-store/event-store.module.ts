import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './event-store.definition';
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs';
import { CONNECTION_NAME } from './connection-name';
import { EventStoreDBClient } from '@eventstore/db-client';

@Global()
@Module({})
export class EventStoreModule extends ConfigurableModuleClass {
  constructor() {
    super();
  }

  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const {
      host,
      port,
      username,
      password,
      retryAttempts = 9,
      retryDelay = 3000,
    } = options;
    const connectionUrl = `esdb+discover://${username}:${password}@${host}:${port}`;
    const logger = new Logger('EventStoreModule');
    const connectionProvider = {
      provide: CONNECTION_NAME,
      useFactory: async (): Promise<any> =>
        await lastValueFrom(
          defer(async () => {
            const client = EventStoreDBClient.connectionString`${connectionUrl}`;
            return {
              ...client,
            };
          }).pipe(
            retry({
              count: retryAttempts,
              delay: (error: string) => {
                logger.error(
                  `Unable to connect to the database. Retrying (${error})...`,
                  '',
                );
                return timer(retryDelay);
              },
            }),
            catchError((error) => {
              // Log the error on final failure
              logger.error(
                `Unable to connect to database after ${retryAttempts} attempts: ${error.message}`,
              );
              throw error; // Re-throw for further handling if needed
            }),
          ),
        ),
    };
    return {
      module: EventStoreModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }
}
