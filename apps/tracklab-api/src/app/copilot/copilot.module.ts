import { Module } from '@nestjs/common';
import { LiveDataController } from './live-data/live-data.controller';
import { CopilotController } from './copilot.controller';
import { LiveDataService } from './live-data/live-data.service';
import { GrpcModule } from '../grpc/grpc.module';
import { CopilotService } from './copilot.service';

@Module({
  controllers: [CopilotController, LiveDataController],
  providers: [LiveDataService, CopilotService],
  imports: [GrpcModule],
})
export class CopilotModule {}
