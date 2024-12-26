import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AuthService } from './auth.service';
import { EventStoreModule } from 'libs/core/infrastructure/event-store/event-store.module';
import { Environment } from 'libs/core/utils/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: Environment.jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          config: {
            host: configService.getOrThrow('AUTHDB_HOST'),
            port: configService.getOrThrow('AUTHDB_PORT'),
            password: configService.getOrThrow('AUTHDB_PASSWORD'),
          },
        };
      },
    }),
    EventStoreModule.forRoot({
      host: Environment.eventStore.host,
      port: Environment.eventStore.port,
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
