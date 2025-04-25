import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrentModule } from './current/current.module';

@Module({
  imports: [CurrentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
