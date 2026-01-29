import { Module } from '@nestjs/common';
import { LiveDataController } from './live-data/live-data.controller';
import { CopilotController } from './copilot.controller';
import { LiveDataService } from './live-data/live-data.service';
import { GrpcModule } from '../grpc/grpc.module';

@Module({
  controllers: [CopilotController, LiveDataController],
  providers: [LiveDataService],
  imports: [GrpcModule],
})
export class CopilotModule {}
