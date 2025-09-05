import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { StandingsDevelopmentComponent } from './standings-development/standings-development.component';
import { DashboardService } from './dashboard.service';
import { StatSpotlightComponent } from './stat-spotlight/stat-spotlight.component';
import { DriverStandingsComponent } from './driver-standings/driver-standings.component';
import { TeamStandingsComponent } from './team-standings/team-standings.component';
import { SeasonProgressComponent } from './season-progress/season-progress.component';
import { ReliabilityTrackerComponent } from './reliability-tracker/reliability-tracker.component';
import { SelectButton, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tl-dashboard',
  imports: [
    StandingsDevelopmentComponent,
    DriverStandingsComponent,
    StatSpotlightComponent,
    TeamStandingsComponent,
    SeasonProgressComponent,
    ReliabilityTrackerComponent,
    SelectButton,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  protected stateOptions = [
    { label: 'Driver', value: 'driver' },
    { label: 'Team', value: 'team' },
  ];

  statSpotlightData = computed(() =>
    this.dashboardService.computeStatSpotlights(),
  );
  seasonResults = this.dashboardService.currentSeason;
  driverStandings = this.dashboardService.driverStandings;

  reliabilityDataSelector = signal<string>('team');

  constructorStandings = computed(() =>
    this.dashboardService.constructorStandings()?.map((entry) => {
      return {
        position: entry.position,
        constructor: entry.Constructor.name,
        points: entry.points,
      };
    }),
  );

  /**
   * Reacts to the changing of the reliability selector changing
   * @param event the change event
   */
  changeReliabilitySelector(event: SelectButtonChangeEvent) {
    this.reliabilityDataSelector.set(event.value);
  }
}
