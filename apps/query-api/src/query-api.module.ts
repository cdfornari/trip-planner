import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { QueryApiResolver } from './query-api.resolver';
import { SurrealModule } from 'libs/core/infrastructure/surrealdb/surrealdb.module';
import { Environment } from 'libs/core/utils/environment';
import { DateScalar } from 'libs/core/infrastructure/gql/date.scalar';

@Module({
  imports: [
    SurrealModule.forRoot({
      host: Environment.surrealDb.host,
      port: Environment.surrealDb.port,
      password: Environment.surrealDb.password,
      username: Environment.surrealDb.user,
      database: Environment.surrealDb.database,
      namespace: Environment.surrealDb.namespace,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [QueryApiResolver, DateScalar],
})
export class QueryApiModule {}
