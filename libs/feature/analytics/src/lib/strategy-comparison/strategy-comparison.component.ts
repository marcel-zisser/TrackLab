import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalysisBaseComponent } from '../analysis-base/analysis-base.component';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tl-strategy-comparison',
  imports: [AnalysisBaseComponent, InputNumber, FormsModule],
  templateUrl: './strategy-comparison.component.html',
  styleUrl: './strategy-comparison.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategyComparisonComponent {
  protected year: number | undefined = 10;
  protected raceOptions: string[] = [];
  protected race: string | undefined;
}
