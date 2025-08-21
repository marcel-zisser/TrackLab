import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsTile } from '@tracklab/models';
import { AutoComplete } from 'primeng/autocomplete';
import { AnalyticsTileComponent } from './analytics-tile/analytics-tile.component';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'tl-analysis-base-selection',
  imports: [AutoComplete, AnalyticsTileComponent],
  templateUrl: './analysis-selection.component.html',
  styleUrl: './analysis-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisSelectionComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected tiles: AnalyticsTile[] = [];

  constructor() {
    this.initTiles();
  }

  /**
   * Initializes the tiles for the analytics screen
   * @private
   */
  private initTiles(): void {
    this.tiles = [
      {
        title: 'Strategy Comparison',
        description:
          'Compare the strategies of different teams for a given race',
        icon: PrimeIcons.BARS,
        callback: () => {
          this.router.navigate(['strategy-comparison'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Team Pace Comparison',
        description: 'Compare the pace of different teams for a given race',
        icon: PrimeIcons.STOPWATCH,
        callback: () => {
          this.router.navigate(['team-pace-comparison'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Speed Traces',
        description: 'Compare the speed traces of different drivers',
        icon: PrimeIcons.CHART_LINE,
        callback: () => {
          this.router.navigate(['speed-traces'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Speed Map',
        description: 'Visualize the speed of a driver on track',
        icon: PrimeIcons.MAP,
        callback: () => {
          this.router.navigate(['speed-map'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Driver Input Comparison',
        description: 'Compare the pedal input of different drivers',
        icon: PrimeIcons.ARROW_RIGHT_ARROW_LEFT,
        callback: () => {
          this.router.navigate(['driver-input'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Gear Shift Visualization',
        description: 'Visualize the gear shifts of a driver on track',
        icon: PrimeIcons.COG,
        callback: () => {
          this.router.navigate(['gear-shift'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Position Change Graph',
        description: 'Visualize the position changes over the course of a race',
        icon: PrimeIcons.SORT_ALT,
        callback: () => {
          this.router.navigate(['position-changes'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
    ];
  }
}
