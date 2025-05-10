import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { CacheModule } from '@nestjs/cache-manager';
import { FastF1Module } from './fast-f1/fast-f1.module';

@Module({
  imports: [
    DashboardModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 60,
    }),
    FastF1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
