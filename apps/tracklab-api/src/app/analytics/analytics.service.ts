import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SessionResultsClient } from '../../generated/results';
import { firstValueFrom } from 'rxjs';
import {
  Circuit,
  CircuitInformation,
  DriverResult,
  EventData,
  RaceResult,
} from '@tracklab/models';
import { EventScheduleClient } from '../../generated/event-schedule';
import { CircuitInfoClient } from '../../generated/circuit';
import { AnalyticsClient, LapsResponse } from '../../generated/analytics';
import { GrpcService } from '../grpc/grpc.service';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsService.name);

  private sessionResultsService: SessionResultsClient;
  private eventScheduleService: EventScheduleClient;
  private circuitService: CircuitInfoClient;
  private analyticsService: AnalyticsClient;

  private readonly raceCache = new Map<
    number,
    Map<number, Map<string, Promise<LapsResponse>>>
  >();

  constructor(@Inject() private grpcService: GrpcService) {}

  onModuleInit() {
    this.sessionResultsService =
      this.grpcService.getService<SessionResultsClient>('SessionResults');
    this.eventScheduleService =
      this.grpcService.getService<EventScheduleClient>('EventSchedule');
    this.circuitService =
      this.grpcService.getService<CircuitInfoClient>('CircuitInfo');
    this.analyticsService =
      this.grpcService.getService<AnalyticsClient>('Analytics');
  }

  async getSessionResults(
    year: number,
    round: number,
    session: number,
  ): Promise<RaceResult[]> {
    const response: RaceResult[] = [];
    const sessionResults = await firstValueFrom(
      this.sessionResultsService.getSessionResults({
        season: year,
        round: round,
        session: session,
      }),
    );

    for (const sessionResult of sessionResults.sessionResults) {
      const mappedResults: DriverResult[] = [];

      sessionResult.driverResults?.forEach((driverResult) => {
        const driver = driverResult.driver;
        const team = driverResult.team;

        mappedResults.push({
          position: driverResult.position,
          points: driverResult.points ?? 0,
          driver: {
            id: driver.id,
            permanentNumber: driver.permanentNumber,
            code: driver.code,
            givenName: driver.givenName,
            familyName: driver.familyName,
            countryCode: driver.countryCode,
            headshotUrl: driver.headshotUrl.replace('1col', '3col'),
          },
          team: {
            id: team.id,
            name: team.name,
            color: `#${team.color}`,
          },
          gridPosition: driverResult.gridPosition,
          status: driverResult.status,
        });
      });

      response.push({
        year: sessionResult.year,
        date: sessionResult.date,
        type: sessionResult.sessionType,
        location: {
          country: sessionResult.location.country,
          locality: sessionResult.location.locality,
        },
        results: mappedResults,
      });
    }

    return response;
  }

  /**
   * Retrieves the even schedule for a given season
   * @param season the season
   */
  async getEventSchedule(season: number): Promise<EventData[]> {
    const eventSchedule = await firstValueFrom(
      this.eventScheduleService.getEventSchedule({ season: season }),
    );

    return eventSchedule.events;
  }

  /**
   * Retrieves circuit base info for a given round in a season
   * @param season the season
   * @param round the round within the season
   */
  async getCircuit(season: number, round: number): Promise<Circuit> {
    return await firstValueFrom(
      this.circuitService.getCircuit({
        year: season,
        round: round,
      }),
    );
  }

  /**
   * Retrieves advanced circuit info for a given round in a season for a given session
   * @param season the season
   * @param round the round within the season
   * @param session the session
   */
  async getCircuitInfo(
    season: number,
    round: number,
    session: string,
  ): Promise<CircuitInformation> {
    return await firstValueFrom(
      this.circuitService.getCircuitInformation({
        year: season,
        round: round,
        session: session,
      }),
    );
  }

  /**
   * Retrieves the strategies for a given session
   * @param year the year of the session
   * @param round the round of the session within the season
   * @param session the session type
   */
  async getSessionStrategy(year: number, round: number, session: string) {
    const lapsResponse = await this.getLaps(year, round, session);
    return await firstValueFrom(
      this.analyticsService.getSessionStrategy({ laps: lapsResponse.laps }),
    );
  }

  /**
   * Retrieves Laps for a given race and driver
   * @param year the year of the race
   * @param round the round of the race
   * @param session the session of the round
   * @param driver the driver to retrieve the lap data from
   */
  async getDriverLaps(
    year: number,
    round: number,
    session: string,
    driver: string,
  ) {
    return await firstValueFrom(
      this.analyticsService.getDriverLaps({
        year: year,
        round: round,
        session: session,
        drivers: [driver],
      }),
    );
  }

  /**
   * Retrieves Quick Laps for a given race
   * @param year the year of the race
   * @param round the round of the race
   */
  async getQuickLaps(year: number, round: number) {
    return await firstValueFrom(
      this.analyticsService.getQuickLaps({ year: year, round: round }),
    );
  }

  /**
   * Retrieves the speed traces for a given session
   * @param year the year of the session
   * @param round the round of the session within the season
   * @param session the session type
   */
  async getSpeedTraces(year: number, round: number, session: string) {
    return await firstValueFrom(
      this.analyticsService.getSpeedTraces({
        year: year,
        round: round,
        session: session,
      }),
    );
  }

  /**
   * Retrieves the speed traces for a given session
   * @param year the year of the session
   * @param round the round of the session within the season
   * @param session the session type
   */
  async getDrivers(year: number, round: number, session: string) {
    return await firstValueFrom(
      this.analyticsService.getDrivers({
        year: year,
        round: round,
        session: session,
      }),
    );
  }

  /**
   * Retrieves the car telemetry for a given session
   * @param year the year of the session
   * @param round the round of the session within the season
   * @param session the session type
   * @param withPosition include position data or not
   */
  async getCarTelemetry(
    year: number,
    round: number,
    session: string,
    withPosition: boolean,
  ) {
    return await firstValueFrom(
      this.analyticsService.getCarTelemetry({
        year: year,
        round: round,
        session: session,
        withPosition: withPosition,
      }),
    );
  }

  /**
   * Retrieves the race position data for a given session
   * @param year the year of the session
   * @param round the round of the session within the season
   */
  async getPositionData(year: number, round: number) {
    const lapsResponse = await this.getLaps(year, round, 'Race');
    return await firstValueFrom(
      this.analyticsService.getPositionData({ laps: lapsResponse.laps }),
    );
  }

  /**
   * Retrieves the WDC contenders for a given year and season progress
   * @param year the year of the season
   * @param round the round of the season to calculate from
   */
  async getWDCContenders(year: number, round: number) {
    return await firstValueFrom(
      this.analyticsService.getChampionshipContenders({
        year: year,
        round: round,
      }),
    );
  }

  /**
   * Retrieves the track domination data between two drivers for a given session
   * @param year the year of the season
   * @param round the round of the season to calculate from
   * @param session the session of the event
   * @param drivers the drivers to compare
   */
  async getTrackDomination(
    year: number,
    round: number,
    session: string,
    drivers: string[],
  ) {
    return await firstValueFrom(
      this.analyticsService.getTrackDomination({
        year: year,
        round: round,
        session: session,
        drivers: drivers,
      }),
    );
  }

  async getGapToLeader(year: number, round: number, session: string) {
    const lapsResponse = await this.getLaps(year, round, session);

    return await firstValueFrom(
      this.analyticsService.getGapToLeader({ laps: lapsResponse.laps }),
    );
  }

  async getColors(year: number, round: number, session: string) {
    return await firstValueFrom(
      this.analyticsService.getColors({
        year: year,
        round: round,
        session: session,
      }),
    );
  }

  /**
   * Loads the laps of a session either from cache or from server
   * @param year the year of the session
   * @param round  the round of the session
   * @param session the name of the session
   * @returns {Promise<LapsResponse>} the laps of the requested session
   */
  async getLaps(
    year: number,
    round: number,
    session: string,
  ): Promise<LapsResponse> {
    const laps =
      this.raceCache.get(year)?.get(round)?.get(session) ?? undefined;
    if (laps) {
      this.logger.log('Race Cache hit.');
      return laps;
    } else {
      this.logger.log('Race Cache miss.');
      const lapsResponse = firstValueFrom(
        this.analyticsService.getLaps({
          year: year,
          round: round,
          session: session,
          threshold: null,
        }),
      );
      if (!this.raceCache.has(year)) {
        this.raceCache.set(year, new Map());
      }

      const roundMap = this.raceCache.get(year);
      if (!roundMap.has(round)) {
        roundMap.set(round, new Map());
      }

      const sessionMap = roundMap.get(round);
      sessionMap.set(session, lapsResponse);

      return lapsResponse;
    }
  }
}
