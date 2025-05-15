import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  Circuit,
  ConstructorStandingsEntry,
  DriverStandingsEntry, Location, RaceResult, Result,
  Standings,
  StandingsResponse
} from '@tracklab/models';

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
  async getCurrentStandingsDevelopment(): Promise<RaceResult[]> {
    const response: RaceResult[] = [];

    await this.queryCurrentSeason(false, response);
    await this.queryCurrentSeason(true, response);

    response.sort((a, b) => {
      if (a.date === b.date) {
        return a.type === 'sprint' ? -1 : 1;
      } else {
        return a.date < b.date ? -1 : 1;
      }
    });

    return response;
  }

  /**
   * Queries the current season and returns the session_results of all races so far
   * @param sprint Fetch races or sprints
   * @param response Array to store the information in
   */
  private async queryCurrentSeason(sprint: boolean, response: RaceResult[]): Promise<void> {
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
        const circuit = {
          circuitId: race.Circuit.circuitId,
          circuitName: race.Circuit.circuitName,
          location: {
            latitude: Number.parseInt(race.Circuit.Location.lat),
            longitude: Number.parseInt(race.Circuit.Location.long),
            locality: race.Circuit.Location.locality,
            country: race.Circuit.Location.country,
          } satisfies Location
        } satisfies Circuit;

        const mappedResults: Result[] = [];

        const results = sprint ? race.SprintResults : race.Results
        results.forEach(result => {
          const driver = result.Driver;
          const constructor = result.Constructor;

          mappedResults.push({
            position: Number.parseInt(result.position),
            points: Number.parseInt(result.points),
            driver: {
              driverId: driver.driverId,
              permanentNumber: Number.parseInt(driver.permanentNumber),
              code: driver.code,
              givenName: driver.givenName,
              familyName: driver.familyName,
              dateOfBirth: driver.dateOfBirth,
              nationality: driver.nationality
            },
            constructor: {
              constructorId: constructor.constructorId,
              name: constructor.name,
              url: constructor.url,
              nationality: constructor.nationality
            },
            grid: Number.parseInt(result.grid),
            laps: Number.parseInt(result.laps),
            status: result.status
          })
        });

        response.push({
          season: race.season,
          round: Number.parseInt(race.round),
          date: race.date,
          time: race.time,
          type: sprint ? 'sprint' : 'race',
          circuit: circuit,
          results: mappedResults
        });
      }

      total = raceResultsResponse.data.MRData.total;
      offset += limit;
    } while (total > offset);
  }
}
