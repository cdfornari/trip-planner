import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiGatewayController } from './api-gateway.controller';
import { Environment } from 'libs/core/utils/environment';
import { EventStoreModule } from 'libs/core/infrastructure/event-store/event-store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: Environment.natsServer,
        transport: Transport.NATS,
        options: {
          servers: Environment.natsServer,
        },
      },
    ]),
    EventStoreModule.forRoot({
      host: Environment.eventStore.host,
      port: Environment.eventStore.port,
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      useFactory: (
        configService: ConfigService<Record<string, unknown>, true>,
      ) => ({
        fallbackLanguage: configService.getOrThrow('DEFAULT_LANGUAGE'),
        fallbacks: {
          'en-*': 'en',
          'es-*': 'es',
          en: 'en',
          es: 'es',
        },
        loaderOptions: {
          path: join(__dirname, configService.getOrThrow('TRANSLATION_PATH')),
          watch: true,
        },
        loader: I18nJsonLoader,
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [ApiGatewayController],
  providers: [],
})
export class ApiGatewayModule {}
