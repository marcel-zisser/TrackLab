import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SessionResultsClient } from '../../generated/results';
import { firstValueFrom } from 'rxjs';
import { Circuit, DriverResult, Event, RaceResult } from '@tracklab/models';
import { EventScheduleClient } from '../../generated/event-schedule';
import { CircuitInfoClient } from '../../generated/circuit';
import { AnalyticsClient } from '../../generated/analytics';

@Injectable()
export class FastF1Service implements OnModuleInit {
  private sessionResultsService: SessionResultsClient;
  private eventScheduleService: EventScheduleClient;
  private circuitService: CircuitInfoClient;
  private analyticsService: AnalyticsClient;

  constructor(@Inject('TRACKLAB_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.sessionResultsService =
      this.client.getService<SessionResultsClient>('SessionResults');
    this.eventScheduleService =
      this.client.getService<EventScheduleClient>('EventSchedule');
    this.circuitService =
      this.client.getService<CircuitInfoClient>('CircuitInfo');
    this.analyticsService =
      this.client.getService<AnalyticsClient>('Analytics');
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

      sessionResult.driverResults.forEach((driverResult) => {
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
  async getEventSchedule(season: number): Promise<Event[]> {
    const eventSchedule = await firstValueFrom(
      this.eventScheduleService.getEventSchedule({ season: season }),
    );

    return eventSchedule.events;
  }

  /**
   * Retrieves circuit info for a given round in a season
   * @param season the season
   * @param round the round within the season
   */
  async getCircuitInfo(season: number, round: number): Promise<Circuit> {
    return await firstValueFrom(
      this.circuitService.getCircuitBaseInformation({
        season: season,
        round: round,
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
    return await firstValueFrom(
      this.analyticsService.getSessionStrategy({
        year: year,
        round: round,
        session: session,
      }),
    );
  }

  async getQuickLaps(year: number, round: number) {
    return await firstValueFrom(
      this.analyticsService.getQuickLaps({ year: year, round: round }),
    );
  }
}
