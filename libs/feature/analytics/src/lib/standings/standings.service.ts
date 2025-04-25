import { computed, inject, Injectable } from '@angular/core';
import { BackendService } from '@tracklab/services';
import { StandingsEntry, StandingsResponse } from '@tracklab/models';

@Injectable({
  providedIn: 'root',
})
export class StandingsService {
  private readonly backendService = inject(BackendService);

  private standings =
    this.backendService.doGet<StandingsResponse>('current/standings');
  private driverStandings = computed<StandingsEntry[] | undefined>(
    () => this.standings.value()?.driverStandings?.standingsList
  );
  private constructorStandings = computed<StandingsEntry[] | undefined>(
    () => this.standings.value()?.constructorStandings?.standingsList
  );

  getDriverStandings() {
    return this.driverStandings;
  }

  getConstructorStandings() {
    return this.constructorStandings;
  }
}
