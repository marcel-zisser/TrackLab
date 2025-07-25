import { Controller, Get, Query } from '@nestjs/common';
import { FastF1Service } from './fast-f1.service';
import {
  Circuit,
  CircuitInformation,
  Event,
  RaceResult,
} from '@tracklab/models';
import {
  QuickLapsResponse,
  SpeedTracesResponse,
  StrategyResponse,
} from '../../generated/analytics';

@Controller('fast-f1')
export class FastF1Controller {
  constructor(private readonly fastF1Service: FastF1Service) {}

  @Get('session-results')
  getSeasonResults(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: number,
  ): Promise<RaceResult[]> {
    return this.fastF1Service.getSessionResults(year, round, session);
  }

  @Get('event-schedule')
  getEventSchedule(@Query('year') year: number): Promise<Event[]> {
    return this.fastF1Service.getEventSchedule(year);
  }

  @Get('circuit')
  getCircuit(
    @Query('year') year: number,
    @Query('round') round: number,
  ): Promise<Circuit> {
    return this.fastF1Service.getCircuit(year, round);
  }

  @Get('circuit-info')
  getCircuitInfo(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<CircuitInformation> {
    return this.fastF1Service.getCircuitInfo(year, round, session);
  }

  @Get('quick-laps')
  getQuickLaps(
    @Query('year') year: number,
    @Query('round') round: number,
  ): Promise<QuickLapsResponse> {
    return this.fastF1Service.getQuickLaps(year, round);
  }

  @Get('strategy')
  getSessionStrategy(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<StrategyResponse> {
    return this.fastF1Service.getSessionStrategy(year, round, session);
  }

  @Get('speed-traces')
  getSpeedTraces(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<SpeedTracesResponse> {
    return this.fastF1Service.getSpeedTraces(year, round, session);
  }
}
