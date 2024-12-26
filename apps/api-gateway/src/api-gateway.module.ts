import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Environment } from 'libs/core/utils/environment';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Environment.natsServer,
        transport: Transport.NATS,
        options: {
          servers: Environment.natsServer,
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [],
})
export class ApiGatewayModule {}
