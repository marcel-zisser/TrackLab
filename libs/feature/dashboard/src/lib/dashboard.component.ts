import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '@tracklab/models';
import { StandingsDevelopmentComponent } from './standings-development/standings-development.component';
import { DashboardService } from './dashboard.service';
import { StatSpotlightComponent } from './stat-spotlight/stat-spotlight.component';
import { DriverStandingsComponent } from './driver-standings/driver-standings.component';
import { TeamStandingsComponent } from './team-standings/team-standings.component';

@Component({
  selector: 'tl-dashboard',
  imports: [
    CommonModule,
    StandingsDevelopmentComponent,
    DriverStandingsComponent,
    StatSpotlightComponent,
    TeamStandingsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  statSpotlightData = computed(() => this.computeStatSpotlights());
  seasonResults = this.dashboardService.currentSeason;
  driverStandings = this.dashboardService.driverStandings;

  constructorStandings = computed(() =>
    this.dashboardService.constructorStandings()?.map((entry) => {
      return {
        position: entry.position,
        constructor: entry.Constructor.name,
        points: entry.points,
      };
    })
  );

  private computeStatSpotlights() {
    const winsPerDriver =
      this.seasonResults()?.reduce((acc, raceResult) => {
        const winner =
          raceResult.results.find((result) => result.position === 1)?.driver
            .code ?? '';

        acc.set(winner, (acc.get(winner) ?? 0) + 1);
        return acc;
      }, new Map<string, number>()) ?? new Map<string, number>();

    const mostWins = Array.from(winsPerDriver?.entries()).reduce(
      (acc, [driver, numberOfWins]) => {
        if (numberOfWins > acc.numberOfWins) {
          return { driver: driver, numberOfWins: numberOfWins };
        }
        return acc;
      },
      { driver: '', numberOfWins: 0 }
    );

    return [
      {
        category: 'Most Wins',
        driver: mostWins.driver,
        data: mostWins.numberOfWins,
      },
    ];
  }
}
