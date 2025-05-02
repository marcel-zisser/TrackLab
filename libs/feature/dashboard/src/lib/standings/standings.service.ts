import { computed, inject, Injectable } from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  ConstructorStandingsEntry,
  DriverStandingsEntry,
  StandingsResponse
} from '@tracklab/models';

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private readonly backendService = inject(BackendService);

  private standings =
    this.backendService.doGet<StandingsResponse>('current/standings');

  driverStandings = computed<DriverStandingsEntry[] | undefined>(
    () => this.standings.value()?.driverStandings?.standingsList
  );
  constructorStandings = computed<ConstructorStandingsEntry[] | undefined>(
    () => this.standings.value()?.constructorStandings?.standingsList
  );
}
