import { Module } from '@nestjs/common';
import { FastF1Controller } from './fast-f1.controller';
import { FastF1Service } from './fast-f1.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  controllers: [FastF1Controller],
  providers: [FastF1Service],
  imports: [
    ClientsModule.register([
      {
        name: 'TRACKLAB_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'at.tracklab',
          url: 'localhost:50051',
          protoPath: join(__dirname, '../tracklab-api/proto/results.proto')
        },
      },
    ]),
  ]
})
export class FastF1Module {}
