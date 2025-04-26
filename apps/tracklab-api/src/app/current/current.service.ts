import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConstructorStandingsEntry, DriverStandingsEntry, Standings, StandingsResponse } from '@tracklab/models';

@Injectable()
export class CurrentService {
  constructor(private readonly httpService: HttpService) {}

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
}
