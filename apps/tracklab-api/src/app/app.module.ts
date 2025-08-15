import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { CacheModule } from '@nestjs/cache-manager';
import { FastF1Module } from './fast-f1/fast-f1.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 60,
    }),
    DashboardModule,
    FastF1Module,
    AuthModule,
    UserModule,
    StorageModule,
    CollectionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
