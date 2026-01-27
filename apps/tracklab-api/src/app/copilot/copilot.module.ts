import { Module } from '@nestjs/common';
import { LiveDataController } from './live-data/live-data.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CopilotController } from './copilot.controller';
import { LiveDataService } from './live-data/live-data.service';

@Module({
  controllers: [CopilotController, LiveDataController],
    imports: [
      ClientsModule.register([
        {
          name: 'TRACKLAB_PACKAGE',
          transport: Transport.GRPC,
          options: {
            package: 'at.tracklab.copilot',
            url: 'localhost:50051',
            protoPath: [join(__dirname, '../tracklab-api/proto/copilot.proto')],
          },
        },
      ]),
    ],
    providers: [LiveDataService],
})
export class CopilotModule {}
