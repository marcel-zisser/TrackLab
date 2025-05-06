import { computed, inject, Injectable } from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  ConstructorStandingsEntry,
  DriverStandingsEntry, RaceResult,
  StandingsResponse
} from '@tracklab/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly backendService = inject(BackendService);

  private standingsResource =
    this.backendService.doGet<StandingsResponse>('dashboard/standings');

  private developmentResource =
    this.backendService.doGet<RaceResult[]>('dashboard/development');

  driverStandings = computed<DriverStandingsEntry[] | undefined>(
    () => this.standingsResource.value()?.driverStandings?.standingsList
  );
  constructorStandings = computed<ConstructorStandingsEntry[] | undefined>(
    () => this.standingsResource.value()?.constructorStandings?.standingsList
  );

  currentSeason = this.developmentResource.value.asReadonly();
}
