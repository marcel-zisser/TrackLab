import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '@tracklab/models'
import { StandingsComponent } from './standings/standings.component';
import { StandingsDevelopmentComponent } from './standings-development/standings-development.component';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'tl-dashboard',
  imports: [CommonModule, StandingsDevelopmentComponent, StandingsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  seasonData = this.dashboardService.currentSeason;

  driverStandings = computed(() =>
    this.dashboardService.driverStandings()?.map( entry => {
      return {
        position: entry.position,
        driver: entry.Driver.code,
        constructor: entry.Constructors[0].name,
        points: entry.points,
      }
    })
  );
  driverColumns: Column[] = [];

  constructorStandings = computed(() =>
    this.dashboardService.constructorStandings()?.map( entry => {
      return {
        position: entry.position,
        constructor: entry.Constructor.name,
        points: entry.points,
      }
    })
  );
  constructorColumns: Column[] = [];

  ngOnInit() {
    this.driverColumns = [
      { field: 'position', header: ''},
      { field: 'driver', header: 'Driver'},
      { field: 'constructor', header: 'Team'},
      { field: 'points', header: 'Points'}
    ]

    this.constructorColumns = [
      { field: 'position', header: ''},
      { field: 'constructor', header: 'Team'},
      { field: 'points', header: 'Points'}
    ]
  }
}
