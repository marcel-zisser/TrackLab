import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ConstructorStandingsEntry,
  DriverStandingsEntry,
  Standings,
  StandingsResponse
} from '@tracklab/models';
import { DevelopmentResponse } from '@tracklab/models';

@Injectable()
export class DashboardService {
  constructor(private readonly httpService: HttpService) {
  }

  async getCurrentStandings(): Promise<StandingsResponse> {
    const driverStandingsResponse = await firstValueFrom(
      this.httpService.get(
        'https://api.jolpi.ca/ergast/f1/current/driverStandings/?format=json'
      )
    );
    const driverStandings = driverStandingsResponse.data.MRData.StandingsTable.StandingsLists[0];

    const constructorStandingsResponse = await firstValueFrom(
      this.httpService.get(
        'https://api.jolpi.ca/ergast/f1/current/constructorStandings/?format=json'
      )
    );
    const constructorStandings = constructorStandingsResponse.data.MRData.StandingsTable.StandingsLists[0];

    return {
      driverStandings: {
        season: driverStandings.season,
        round: driverStandings.round,
        standingsList: driverStandings.DriverStandings
      } satisfies Standings<DriverStandingsEntry>,
      constructorStandings: {
        season: constructorStandings.season,
        round: constructorStandings.round,
        standingsList: constructorStandings.ConstructorStandings
      } satisfies Standings<ConstructorStandingsEntry>
    };
  }

  /**
   * Retrieves the driver development for the current season
   */
  async getCurrentStandingsDevelopment(): Promise<DevelopmentResponse[]> {
    const driverDevelopmentMap = new Map<string, Map<string, number>>();

    await this.computePointsPerRace(false, driverDevelopmentMap);
    await this.computePointsPerRace(true, driverDevelopmentMap);

    const accumulatedPointsMap = this.accumulatePoints(driverDevelopmentMap)
    const response: DevelopmentResponse[] = [];

    accumulatedPointsMap.forEach((value, key) =>
      response.push({
        driverCode: key,
        development: value
      })
    );

    return response;
  }

  /**
   * Accumulates the points a driver has achieved using a specified URL
   * @param sprint Fetch races or sprints
   * @param driverDevelopmentMap map to store information in
   */
  private async computePointsPerRace(sprint: boolean, driverDevelopmentMap: Map<string, Map<string, number>>): Promise<void> {
    const limit = 100;
    let offset = 0;
    let total = 0;

    do {
      const raceResultsResponse = await firstValueFrom(
        this.httpService.get(
          `https://api.jolpi.ca/ergast/f1/current/${sprint ? 'sprint' : 'results'}/?format=json&limit=${limit}&offset=${offset}`
        )
      );

      for (const race of raceResultsResponse.data.MRData.RaceTable.Races) {
        const results = sprint ? race.SprintResults : race.Results
        results.forEach(result => {
          const points = Number.parseInt(result.points);
          const locality = race.Circuit.Location.locality;
          const driverCode = result.Driver.code;

          if (!driverDevelopmentMap.has(driverCode)) {
            driverDevelopmentMap.set(driverCode, new Map());
          }

          const driverResults = driverDevelopmentMap.get(driverCode);

          if (driverResults.has(locality)) {
            const driverPoints = driverResults.get(locality);
            driverResults.set(locality, driverPoints + points);
          } else {
            driverResults.set(locality, points);
          }
        });
      }

      total = raceResultsResponse.data.MRData.total;
      offset += limit;
    } while (total > offset);
  }

  private accumulatePoints(driverDevelopmentMap: Map<string, Map<string, number>>) {
    const accumulatedPointsMap = new Map<string, number[]>();

    driverDevelopmentMap.forEach((results, key) => {
      accumulatedPointsMap.set(
        key,
        Array.from(results.values()).reduce((acc, val, i) => {
          acc.push((acc[i - 1] || 0) + val);
          return acc;
        }, [])
        );
    });

    return accumulatedPointsMap;
  }
}
