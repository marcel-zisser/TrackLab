import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChartBaseComponent } from '../../chart-base';

@Component({
  selector: 'tl-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrl: './chart-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartBaseComponent],
})
export class ChartDialogComponent implements AfterViewInit {
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);

  protected readonly chartConfig = signal(undefined);

  ngAfterViewInit(): void {
    this.chartConfig.set(this.dialogConfig.data.options());
  }
}
