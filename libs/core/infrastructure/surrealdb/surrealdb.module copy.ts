import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { RecordId, Surreal } from 'surrealdb';
import { ConfigurableModuleClass, OPTIONS_TYPE } from './surrealdb.definition';
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs';
import { CONNECTION_NAME } from './connection-name';

@Global()
@Module({})
export class SurrealModule extends ConfigurableModuleClass {
  constructor() {
    super();
  }

  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const {
      url,
      port,
      username,
      password,
      namespace,
      database,
      retryAttempts = 9,
      retryDelay = 3000,
    } = options;
    const connectionUrl = url + `:${port}`;
    const logger = new Logger('SurrealDBModule');
    const connectionProvider = {
      provide: CONNECTION_NAME,
      useFactory: async (): Promise<any> =>
        await lastValueFrom(
          defer(async () => {
            const surreal = await SurrealModule.createConnection(
              connectionUrl,
              username,
              password,
              namespace,
              database,
            );
            return {
              create: <T extends { [x: string]: unknown }>(
                id: RecordId,
                data?: T,
              ) => surreal.create<T, T>(id, data),
              update: <T extends { [x: string]: unknown }>(
                id: RecordId,
                data?: Partial<T>,
              ) => surreal.merge(id, data),
              delete: (id: RecordId) => surreal.delete(id),
              clear: (table: string) => surreal.delete(table),
              findOne: <T extends { [x: string]: unknown }>(id: RecordId) =>
                surreal.select<T>(id)[0],
              query: <T extends unknown[]>(query: string) =>
                surreal.query<T>(query),
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
      module: SurrealModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }

  private static async createConnection(
    url: string,
    username: string,
    password: string,
    namespace: string,
    database: string,
  ): Promise<Surreal> {
    const surreal = new Surreal();
    await surreal.connect(url);
    await surreal.signin({
      username,
      password,
    });
    await surreal.use({
      namespace,
      database,
    });
    return surreal;
  }
}
