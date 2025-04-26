import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CurrentService } from './current.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingCacheInterceptor } from '../interceptors/cache-logging.interceptor';

@UseInterceptors(LoggingCacheInterceptor)
@Controller('current')
export class CurrentController {

  constructor(private currentService: CurrentService){}

  @Get('standings')
  getCurrentStandings() {
    return this.currentService.getCurrentStandings();
  }
}
