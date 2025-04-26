import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingCacheInterceptor } from './interceptors/cache-logging.interceptor';

@UseInterceptors(LoggingCacheInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
