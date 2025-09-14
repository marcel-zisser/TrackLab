import { computed, inject, Injectable } from '@angular/core';
import { DashboardService } from '../dashboard.service';

export type DriverReliability = {
  driverCode: string;
  team: string;
  color: string;
  fails: Map<string, number>;
};

export type TeamReliability = {
  team: string;
  color: string;
  fails: Map<string, number>;
};

@Injectable({
  providedIn: 'root',
})
export class ReliabilityTrackerService {
  private readonly dashboardService = inject(DashboardService);

  private readonly currentSeason = this.dashboardService.currentSeason;

  driverReliability = computed(() => {
    const reliabilityMap = new Map<string, DriverReliability>();

    for (const race of this.currentSeason() ?? []) {
      for (const driverResult of race.results) {
        if (
          driverResult.status !== 'Finished' &&
          !driverResult.status.includes('Lap')
        ) {
          const driverReliability = reliabilityMap.get(
            driverResult.driver.code,
          ) ?? {
            driverCode: driverResult.driver.code,
            team: driverResult.team.name,
            color: driverResult.team.color ?? '#777',
            fails: new Map<string, number>(),
          };
          driverReliability.fails.set(
            driverResult.status,
            (driverReliability.fails.get(driverResult.status) ?? 0) + 1,
          );

          reliabilityMap.set(driverResult.driver.code, driverReliability);
        }
      }
    }

    return reliabilityMap;
  });

  teamReliability = computed(() => {
    const teamReliabilityMap = new Map<string, TeamReliability>();

    this.driverReliability().forEach((driverReliability) => {
      const teamReliability = teamReliabilityMap.get(
        driverReliability.team,
      ) ?? {
        team: driverReliability.team,
        color: driverReliability.color,
        fails: new Map<string, number>(),
      };
      driverReliability.fails.forEach((value, key) =>
        teamReliability.fails.set(
          key,
          (teamReliability.fails.get(key) ?? 0) + value,
        ),
      );

      teamReliabilityMap.set(driverReliability.team, teamReliability);
    });

    return teamReliabilityMap;
  });
}
