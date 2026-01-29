import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { GrpcModule } from '../grpc/grpc.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [
    CacheModule.register({
      ttl: 1000 * 60 * 60,
    }),
    GrpcModule
  ],
})
export class AnalyticsModule {}
