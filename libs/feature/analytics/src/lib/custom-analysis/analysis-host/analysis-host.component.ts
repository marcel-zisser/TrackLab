import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Type,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstructionComponent } from '@tracklab/components';
import { NgComponentOutlet } from '@angular/common';
import { PositionChangesComponent } from '../analyses/position-changes/position-changes.component';
import {
  DriverInputAnalysisComponent,
  GearShiftComponent,
  LaptimeScatterComponent,
  SpeedMapComponent,
  SpeedTracesComponent,
  StrategyComparisonComponent,
  TeamPaceComparisonComponent,
  TrackDominationComponent,
  WdcContendersComponent,
} from '../analyses';

@Component({
  selector: 'tl-analysis-host',
  imports: [NgComponentOutlet],
  templateUrl: './analysis-host.component.html',
  styleUrl: './analysis-host.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisHostComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly analysisMap = new Map<string, Type<any>>([
    ['strategy-comparison', StrategyComparisonComponent],
    ['speed-traces', SpeedTracesComponent],
    ['team-pace-comparison', TeamPaceComparisonComponent],
    ['driver-input', DriverInputAnalysisComponent],
    ['gear-shift', GearShiftComponent],
    ['speed-map', SpeedMapComponent],
    ['position-changes', PositionChangesComponent],
    ['wdc-contenders', WdcContendersComponent],
    ['track-domination', TrackDominationComponent],
    ['laptime-scatter', LaptimeScatterComponent],
  ]);

  protected componentToRender: Type<any> | null = null;

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type') ?? '';
    this.componentToRender =
      this.analysisMap.get(type) ?? ConstructionComponent;
  }
}
