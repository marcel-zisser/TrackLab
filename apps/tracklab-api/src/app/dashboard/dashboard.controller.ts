import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private currentService: DashboardService) {}

  @Get('standings')
  getCurrentStandings() {
    return this.currentService.getCurrentStandings();
  }
}
