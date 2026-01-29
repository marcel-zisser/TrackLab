import { Module } from '@nestjs/common';
import { GrpcService } from './grpc.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRACKLAB_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'at.tracklab',
          url: 'localhost:50051',
          protoPath: [
            join(__dirname, '../tracklab-api/proto/results.proto'),
            join(__dirname, '../tracklab-api/proto/event-schedule.proto'),
            join(__dirname, '../tracklab-api/proto/circuit.proto'),
            join(__dirname, '../tracklab-api/proto/analytics.proto'),
            join(__dirname, '../tracklab-api/proto/copilot.proto'),
          ],
        },
      },
    ]),
  ],
  providers: [GrpcService],
  exports: [GrpcService],
})
export class GrpcModule {}
