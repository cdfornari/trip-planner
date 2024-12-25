import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
