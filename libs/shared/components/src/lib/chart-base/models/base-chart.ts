import { EChartsCoreOption } from 'echarts';
import { Signal, WritableSignal } from '@angular/core';
import { RaceSelection } from '@tracklab/models';
import { ChartBaseComponent } from '../chart-base.component';

export abstract class BaseChart {
  abstract chart: Signal<ChartBaseComponent>;
  abstract chartOptions: WritableSignal<EChartsCoreOption>;

  protected abstract loadData(selectedRace: RaceSelection): void;
}
