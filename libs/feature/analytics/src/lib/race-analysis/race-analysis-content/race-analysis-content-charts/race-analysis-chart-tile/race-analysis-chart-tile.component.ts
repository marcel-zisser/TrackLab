import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseChart, ChartDialogComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-race-analysis-chart-tile',
  imports: [Button],
  templateUrl: './race-analysis-chart-tile.component.html',
  styleUrl: './race-analysis-chart-tile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceAnalysisChartTileComponent {
  title = input<string>();

  private readonly dialogService = inject(DialogService);

  protected chartContent =
    viewChild.required<ElementRef<HTMLElement>>('chartContent');
  protected chart = contentChild<BaseChart>('chart');
  protected readonly PrimeIcons = PrimeIcons;

  maximizeChart() {
    const projectedNodes = Array.from(
      this.chartContent().nativeElement.childNodes,
    );
    const dialog = this.dialogService.open(ChartDialogComponent, {
      data: { options: this.chart()?.chartOptions },
      header: this.title(),
      modal: true,
      closable: true,
      height: '90%',
      width: '90%',
    });
  }
}
