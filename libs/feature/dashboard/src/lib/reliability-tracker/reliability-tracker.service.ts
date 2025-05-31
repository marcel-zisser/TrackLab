import { computed, inject, Injectable } from '@angular/core';
import { DashboardService } from '../dashboard.service';

export type DriverReliability = {
  driverCode: string,
  team: string,
  color: string,
  fails: number
}

export type TeamReliability = {
  team: string,
  color: string,
  fails: number
}

@Injectable({
  providedIn: 'root'
})
export class ReliabilityTrackerService {
  private readonly dashboardService = inject(DashboardService);

  private readonly currentSeason = this.dashboardService.currentSeason;

  driverReliability = computed(() => {
    const reliabilityMap = new Map<string, DriverReliability>();

    for (const race of this.currentSeason() ?? []) {
      for (const result of race.results) {
        if (result.status === 'Retired' || result.status === 'Disqualified') {
          const driverReliability = reliabilityMap.get(result.driver.code) ?? {
            driverCode: result.driver.code,
            team: result.team.name,
            color: result.team.color ?? '#f00',
            fails: 0
          };
          driverReliability.fails++;

          reliabilityMap.set(result.driver.code, driverReliability);
        }
      }
    }

    return reliabilityMap;
  });

  teamReliability = computed(() => {
    const teamReliabilityMap = new Map<string, TeamReliability>();

    this.driverReliability().forEach(driverReliability => {
      const teamReliability = teamReliabilityMap.get(driverReliability.team) ?? {
        team: driverReliability.team,
        color: driverReliability.color,
        fails: 0
      };
      teamReliability.fails += driverReliability.fails;

      teamReliabilityMap.set(driverReliability.team, teamReliability);
    });

    return teamReliabilityMap;
  });
}
