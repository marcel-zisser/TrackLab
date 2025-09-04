import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsTile } from '@tracklab/models';
import { AnalyticsTileComponent } from './analytics-tile/analytics-tile.component';
import { PrimeIcons } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'tl-analysis-base-selection',
  imports: [
    AnalyticsTileComponent,
    InputText,
    FormsModule,
    IconField,
    InputIcon,
  ],
  templateUrl: './analysis-selection.component.html',
  styleUrl: './analysis-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisSelectionComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private tiles: AnalyticsTile[] = [];

  protected filterString = signal<string>('');
  protected filteredTiles = computed(() => {
    const filter = this.filterString().toLowerCase();
    return this.tiles.filter(
      (tile) =>
        tile.title.toLowerCase().includes(filter) ||
        tile.description.toLowerCase().includes(filter) ||
        tile.tags.some((tag) => tag.toLowerCase().includes(filter)),
    );
  });

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
        tags: ['strategy', 'tires', 'team'],
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
        tags: ['team', 'pace', 'laptime'],
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
        tags: ['driver', 'speed', 'comparison', 'telemetry'],
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
        tags: ['speed', 'telemetry', 'driver', 'track'],
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
        tags: ['driver', 'comparison', 'telemetry'],
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
        tags: ['driver', 'telemetry', 'track'],
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
        tags: ['driver', 'race'],
        callback: () => {
          this.router.navigate(['position-changes'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'WDC Contenders',
        description: 'Who is still in the title race?',
        icon: PrimeIcons.TROPHY,
        tags: ['championship', 'driver'],
        callback: () => {
          this.router.navigate(['wdc-contenders'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Track Domination',
        description: 'Who dominates which part of the track?',
        icon: PrimeIcons.BOLT,
        tags: ['telemetry', 'track', 'driver'],
        callback: () => {
          this.router.navigate(['track-domination'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        title: 'Lap Times Scatter',
        description: 'Scatter plot of a drivers lap times in a race.',
        icon: PrimeIcons.CHART_SCATTER,
        tags: ['laps', 'driver', 'telemetry'],
        callback: () => {
          this.router.navigate(['laptime-scatter'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
    ];
  }
}
