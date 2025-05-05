import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { LoggingCacheInterceptor } from '../interceptors/cache-logging.interceptor';

@UseInterceptors(LoggingCacheInterceptor)
@Controller('dashboard')
export class DashboardController {

  constructor(private currentService: DashboardService){}

  @Get('standings')
  getCurrentStandings() {
    return this.currentService.getCurrentStandings();
  }

  @Get('development')
  getCurrentStandingsDevelopment() {
    return this.currentService.getCurrentStandingsDevelopment();
  }
}
