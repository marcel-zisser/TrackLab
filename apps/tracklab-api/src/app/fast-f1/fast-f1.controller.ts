import { Controller, Get } from '@nestjs/common';
import { FastF1Service } from './fast-f1.service';
import { RaceResult } from '@tracklab/models';

@Controller('fast-f1')
export class FastF1Controller {
  constructor(private readonly fastF1Service: FastF1Service) {
  }

  @Get('test')
  getCurrentSeasonResults(): Promise<RaceResult[]> {
    return this.fastF1Service.getSessionResults();
  }
}
