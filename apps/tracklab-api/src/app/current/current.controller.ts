import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CurrentService } from './current.service';
import { LoggingCacheInterceptor } from '../interceptors/cache-logging.interceptor';

@UseInterceptors(LoggingCacheInterceptor)
@Controller('current')
export class CurrentController {

  constructor(private currentService: CurrentService){}

  @Get('standings')
  getCurrentStandings() {
    return this.currentService.getCurrentStandings();
  }

  @Get('development')
  getCurrentStandingsDevelopment() {
    return this.currentService.getCurrentStandingsDevelopment();
  }
}
