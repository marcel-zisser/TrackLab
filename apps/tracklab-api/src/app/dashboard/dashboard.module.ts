import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
