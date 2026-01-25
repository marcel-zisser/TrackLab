import { Module } from '@nestjs/common';
import { CopilotController } from './copilot.controller';
import { LiveDataController } from './live-data/live-data.controller';

@Module({
  controllers: [CopilotController],
  imports: [LiveDataController],
})
export class CopilotModule {}
