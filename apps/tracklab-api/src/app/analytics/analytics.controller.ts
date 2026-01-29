import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  Circuit,
  CircuitInformation,
  EventData,
  RaceResult,
} from '@tracklab/models';
import {
  CarTelemetryResponse,
  ChampionshipContendersResponse,
  ColorResponse,
  DriversResponse,
  GapToLeaderResponse,
  LapsResponse,
  PositionDataResponse,
  SpeedTracesResponse,
  StrategyResponse,
  TrackDominationResponse,
} from '../../generated/analytics';
import { LoggingCacheInterceptor } from '../interceptors/cache-logging.interceptor';

@UseInterceptors(LoggingCacheInterceptor)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('colors')
  getColors(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<ColorResponse> {
    return this.analyticsService.getColors(year, round, session);
  }

  @Get('session-results')
  getSeasonResults(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: number,
  ): Promise<RaceResult[]> {
    return this.analyticsService.getSessionResults(year, round, session);
  }

  @Get('event-schedule')
  getEventSchedule(@Query('year') year: number): Promise<EventData[]> {
    return this.analyticsService.getEventSchedule(year);
  }

  @Get('circuit')
  getCircuit(
    @Query('year') year: number,
    @Query('round') round: number,
  ): Promise<Circuit> {
    return this.analyticsService.getCircuit(year, round);
  }

  @Get('circuit-info')
  getCircuitInfo(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<CircuitInformation> {
    return this.analyticsService.getCircuitInfo(year, round, session);
  }

  @Get('driver-laps')
  getDriverLaps(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
    @Query('driver') driver: string,
  ): Promise<LapsResponse> {
    return this.analyticsService.getDriverLaps(year, round, session, driver);
  }

  @Get('quick-laps')
  getQuickLaps(
    @Query('year') year: number,
    @Query('round') round: number,
  ): Promise<LapsResponse> {
    return this.analyticsService.getQuickLaps(year, round);
  }

  @Get('strategy')
  getSessionStrategy(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<StrategyResponse> {
    return this.analyticsService.getSessionStrategy(year, round, session);
  }

  @Get('speed-traces')
  getSpeedTraces(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<SpeedTracesResponse> {
    return this.analyticsService.getSpeedTraces(year, round, session);
  }

  @Get('drivers')
  getDrivers(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<DriversResponse> {
    return this.analyticsService.getDrivers(year, round, session);
  }

  @Get('car-telemetry')
  getCarTelemetry(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
    @Query('withPosition') withPosition: boolean,
  ): Promise<CarTelemetryResponse> {
    return this.analyticsService.getCarTelemetry(
      year,
      round,
      session,
      withPosition,
    );
  }

  @Get('position-data')
  getPositionData(
    @Query('year') year: number,
    @Query('round') round: number,
  ): Promise<PositionDataResponse> {
    return this.analyticsService.getPositionData(year, round);
  }

  @Get('wdc-contenders')
  getWDCContenders(
    @Query('year') year: number,
    @Query('round') round: number,
  ): Promise<ChampionshipContendersResponse> {
    return this.analyticsService.getWDCContenders(year, round);
  }

  @Get('track-domination')
  getTrackDomination(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
    @Query('drivers') drivers: string[],
  ): Promise<TrackDominationResponse> {
    return this.analyticsService.getTrackDomination(year, round, session, drivers);
  }

  @Get('leader-gap')
  getGapToLeader(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<GapToLeaderResponse> {
    return this.analyticsService.getGapToLeader(year, round, session);
  }

  @Get('laps')
  getLaps(
    @Query('year') year: number,
    @Query('round') round: number,
    @Query('session') session: string,
  ): Promise<LapsResponse> {
    return this.analyticsService.getLaps(year, round, session);
  }
}
