import { Module } from '@nestjs/common';
import { CurrentController } from './current.controller';
import { CurrentService } from './current.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule],
  controllers: [CurrentController],
  providers: [CurrentService],
})
export class CurrentModule {}
