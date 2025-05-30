import { computed, inject, Injectable } from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  ConstructorStandingsEntry,
  DriverStandingsEntry,
  RaceResult,
  StandingsResponse,
  Event
} from '@tracklab/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly backendService = inject(BackendService);

  private eventScheduleResource =
    this.backendService.doGetResource<Event[]>(`fast-f1/event-schedule?year=${new Date().getFullYear()}`);

  private standingsResource =
    this.backendService.doGetResource<StandingsResponse>('dashboard/standings');

  private developmentResource =
    this.backendService.doGetResource<RaceResult[]>(`fast-f1/session-results?year=${new Date().getFullYear()}`);

  eventSchedule = this.eventScheduleResource.value.asReadonly();

  currentSeason = this.developmentResource.value.asReadonly();

  constructorStandings = computed<ConstructorStandingsEntry[] | undefined>(
    () => this.standingsResource.value()?.constructorStandings?.standingsList
  );
  driverStandings = computed(() => {
    const standingsMap = new Map<string, DriverStandingsEntry>();

    this.currentSeason()?.forEach((race) => {
      race.results.forEach((result) => {
        const newEntry = {
          driver: result.driver,
          teams: [result.team],
          points: result.points,
          wins: result.position === 1 ? 1 : 0,
          position: result.position
        } satisfies DriverStandingsEntry;

        if (standingsMap.has(result.driver.code)) {
          const entry = standingsMap.get(result.driver.code) ?? newEntry;
          if (!entry.teams.find(team => team.id === result.team.id)) {
            entry.teams.push(result.team);
          }
          entry.points += result.points;
          entry.wins += result.position === 1 ? 1 : 0;
        } else {
          standingsMap.set(result.driver.code, newEntry);
        }
      });
    });

    return Array.from(standingsMap.values()).sort((standingA, standingB) => standingB.points - standingA.points);
  });
}
