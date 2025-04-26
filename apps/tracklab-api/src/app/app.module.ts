import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrentModule } from './current/current.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CurrentModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 1000*60*60
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
