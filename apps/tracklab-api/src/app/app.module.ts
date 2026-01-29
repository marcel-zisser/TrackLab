import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { CollectionModule } from './collection/collection.module';
import { CopilotModule } from './copilot/copilot.module';
import { GrpcModule } from './grpc/grpc.module';

@Module({
  imports: [
    DashboardModule,
    AnalyticsModule,
    AuthModule,
    UserModule,
    StorageModule,
    CollectionModule,
    CopilotModule,
    GrpcModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
