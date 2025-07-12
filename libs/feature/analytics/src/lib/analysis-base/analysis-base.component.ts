import { ChangeDetectionStrategy, Component  } from '@angular/core';

@Component({
  selector: 'tl-analysis-base',
  imports: [],
  templateUrl: './analysis-base.component.html',
  styleUrl: './analysis-base.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisBaseComponent {}
