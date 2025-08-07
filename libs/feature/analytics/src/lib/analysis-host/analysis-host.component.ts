import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Type,
} from '@angular/core';
import {
  DriverInputComponent,
  GearShiftComponent,
  SpeedTracesComponent,
  StrategyComparisonComponent,
  TeamPaceComparisonComponent,
} from '../analyses';
import { ActivatedRoute } from '@angular/router';
import { ConstructionComponent } from '@tracklab/shared/components';
import { NgComponentOutlet } from '@angular/common';

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
    ['driver-input', DriverInputComponent],
    ['gear-shift', GearShiftComponent],
  ]);

  protected componentToRender: Type<any> | null = null;

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type') ?? '';
    this.componentToRender =
      this.analysisMap.get(type) ?? ConstructionComponent;
  }
}
