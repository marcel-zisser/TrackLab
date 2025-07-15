import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ThemeService } from '@tracklab/services';
import { ReliabilityTrackerService } from './reliability-tracker.service';

@Component({
  selector: 'tl-reliability-tracker',
  imports: [NgxEchartsDirective],
  templateUrl: './reliability-tracker.component.html',
  styleUrl: './reliability-tracker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReliabilityTrackerComponent {
  private readonly themeService = inject(ThemeService);
  private readonly reliabilityTrackerService = inject(ReliabilityTrackerService);

  dataSelector = input.required<string>();

  reliabilityData = computed(() => {
    if (this.dataSelector() === 'driver') {
      return this.reliabilityTrackerService.driverReliability();
    } else {
      return this.reliabilityTrackerService.teamReliability();
    }
  });

  protected readonly chartTheme = this.themeService.chartTheme;

  chartOptions = computed(() => ({
    tooltip: {
      trigger: 'item',
      enterable: true,
      order: 'valueDesc',
      confine: false,
      appendTo: 'body',
      className: 'tl-tooltip'
    },
    legend: {
      data: Array.from(this.reliabilityData().keys()),
      type: 'scroll',
      orient: 'horizontal',
      top: 0,
      wrap: true,
      scroll: true
    },
    toolbox: {
      feature: {
        // saveAsImage: {},
      }
    },
    series: {
      name: this.dataSelector(),
      type: 'pie',
      selectedMode: 'single',
      top: 30,
      radius: [0, '75%'],
      label: {
        position: 'outside'
      },
      labelLine: {
        show: true
      },
      data: Array.from(this.reliabilityData().entries()).map(([key, value]) => ({
        name: key,
        value: value.fails,
        itemStyle: {
          color: value.color
        }
      })).sort((a, b) => b.value - a.value)
    }
  }));
}
