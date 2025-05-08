import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '@tracklab/models';
import { StandingsComponent } from './standings/standings.component';
import { StandingsDevelopmentComponent } from './standings-development/standings-development.component';
import { DashboardService } from './dashboard.service';
import { StatSpotlightComponent } from './stat-spotlight/stat-spotlight.component';

@Component({
  selector: 'tl-dashboard',
  imports: [
    CommonModule,
    StandingsDevelopmentComponent,
    StandingsComponent,
    StatSpotlightComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  constructorColumns: Column[] = [];
  driverColumns: Column[] = [];
  statSpotlightColumns: Column[] = [];

  statSpotlightData = computed(() => this.computeStatSpotlights());
  seasonResults = this.dashboardService.currentSeason;
  driverStandings = computed(() =>
    this.dashboardService.driverStandings()?.map((entry) => {
      return {
        position: entry.position,
        driver: entry.Driver.code,
        constructor: entry.Constructors[entry.Constructors.length - 1].name,
        points: entry.points,
      };
    })
  );
  constructorStandings = computed(() =>
    this.dashboardService.constructorStandings()?.map((entry) => {
      return {
        position: entry.position,
        constructor: entry.Constructor.name,
        points: entry.points,
      };
    })
  );

  constructor() {
    effect(() => {
      console.log(this.statSpotlightData());
    });
  }

  ngOnInit() {
    this.driverColumns = [
      { field: 'position', header: '' },
      { field: 'driver', header: 'Driver' },
      { field: 'constructor', header: 'Team' },
      { field: 'points', header: 'Points' },
    ];

    this.constructorColumns = [
      { field: 'position', header: '' },
      { field: 'constructor', header: 'Team' },
      { field: 'points', header: 'Points' },
    ];

    this.statSpotlightColumns = [
      { field: 'category', header: 'Category' },
      { field: 'driver', header: 'Driver' },
      { field: 'data', header: 'Data' },
    ];
  }

  private computeStatSpotlights() {
    const winsPerDriver = this.seasonResults()?.reduce((acc, raceResult) => {
      const winner =
        raceResult.results.find((result) => result.position === 1)?.driver
          .code ?? '';

      acc.set(winner, (acc.get(winner) ?? 0) + 1);
      return acc;
    }, new Map<string, number>()) ?? new Map<string, number>();

    const mostWins = Array.from(winsPerDriver?.entries()).reduce((acc, [driver, numberOfWins]) => {
      if (numberOfWins > acc.numberOfWins) {
        return { driver: driver, numberOfWins: numberOfWins };
      }
      return acc;
    }, {driver: '', numberOfWins: 0})

    return [
      {
        category: 'Most Wins',
        driver: mostWins.driver,
        data: mostWins.numberOfWins
      }
    ]
  }
}
