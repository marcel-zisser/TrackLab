import { Controller, Get } from '@nestjs/common';
import { CurrentService } from './current.service';

@Controller('current')
export class CurrentController {

  constructor(private currentService: CurrentService){}

  @Get('standings')
  getCurrentStandings() {
    return this.currentService.getCurrentStandings();
  }
}
