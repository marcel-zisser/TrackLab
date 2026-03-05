import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ConstructorStandingsEntry,
  DriverStandingsEntry,
  Standings,
  StandingsResponse,
} from '@tracklab/models';

@Injectable()
export class DashboardService {
  constructor(private readonly httpService: HttpService) {}

  async getCurrentStandings(): Promise<StandingsResponse> {
    const currentYear = new Date().getFullYear();
    const driverStandingsResponse = await firstValueFrom(
      this.httpService.get(
        `https://api.jolpi.ca/ergast/f1/${currentYear}/driverStandings/?format=json`,
      ),
    );
    const driverStandings =
      driverStandingsResponse.data.MRData.StandingsTable.StandingsLists?.[0];

    const constructorStandingsResponse = await firstValueFrom(
      this.httpService.get(
        `https://api.jolpi.ca/ergast/f1/${currentYear}/constructorStandings/?format=json`,
      ),
    );
    const constructorStandings =
      constructorStandingsResponse.data.MRData.StandingsTable.StandingsLists?.[0];

    const response: StandingsResponse = {
      driverStandings: undefined,
      constructorStandings: undefined,
    };

    if (driverStandings) {
      response.driverStandings = {
            season: driverStandings.season,
            round: driverStandings.round,
            standingsList: driverStandings.DriverStandings,
          } satisfies Standings<DriverStandingsEntry>;
    }
    
    if (constructorStandings) {
      response.constructorStandings = {
        season: constructorStandings.season,
        round: constructorStandings.round,
        standingsList: constructorStandings.ConstructorStandings,
      } satisfies Standings<ConstructorStandingsEntry>;
    }

    return response;
  }
}
