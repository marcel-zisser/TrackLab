import { Controller, Get, Query } from '@nestjs/common';
import { FastF1Service } from './fast-f1.service';
import { Circuit, Event, RaceResult } from '@tracklab/models';

@Controller('fast-f1')
export class FastF1Controller {
  constructor(private readonly fastF1Service: FastF1Service) {
  }

  @Get('session-results')
  getSeasonResults(@Query('year') year: number,
                   @Query('round') round: number,
                   @Query('session') session: number): Promise<RaceResult[]> {
    return this.fastF1Service.getSessionResults(year, round, session);
  }

  @Get('event-schedule')
  getEventSchedule(@Query('year') year: number): Promise<Event[]> {
    return this.fastF1Service.getEventSchedule(year);
  }

  @Get('circuit')
  getCircuitInfo(@Query('year') year: number, @Query('round') round: number): Promise<Circuit> {
    return this.fastF1Service.getCircuitInfo(year, round);
  }
}
