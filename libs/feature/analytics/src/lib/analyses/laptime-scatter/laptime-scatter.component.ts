import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  Event,
  Lap,
  LapsResponse,
  RaceSelection,
  TireColors,
  TireCompound,
} from '@tracklab/models';
import {
  AnalysisBaseComponent,
  SourceSelectionComponent,
} from '../../analysis-base';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChartBaseComponent } from '../../analysis-base/chart-base/chart-base.component';
import {
  convertToMilliseconds,
  millisecondsToTimingString,
} from '@tracklab/util';

type ProcessedLapTime = [number, number, string];

@Component({
  selector: 'tl-laptime-scatter',
  imports: [
    AnalysisBaseComponent,
    SourceSelectionComponent,
    FormsModule,
    ChartBaseComponent,
  ],
  templateUrl: './laptime-scatter.component.html',
  styleUrl: './laptime-scatter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaptimeScatterComponent {
  private readonly backendService = inject(BackendService);

  private readonly minLapTime = computed<number>(() =>
    Math.min(...(this.processedData()?.map((lap) => lap[1]) ?? [])),
  );
  private readonly tireCompounds = computed<TireCompound[]>(() => {
    const compounds = new Set<TireCompound>();
    this.processedData()?.forEach((lap) =>
      compounds.add(lap[2] as TireCompound),
    );
    return Array.from(compounds.values());
  });

  protected selectedYear: string | undefined;
  protected selectedEvent: Event | undefined;
  protected selectedSession: string | undefined;
  protected driver: string | undefined;

  protected readonly laps = signal<Lap[] | undefined>(undefined);

  protected readonly processedData = computed<ProcessedLapTime[] | undefined>(
    () => this.processData(this.laps()),
  );

  protected readonly chartOptions = computed(() => this.createChartOptions());

  /**
   * Loads the laptime data for a given driver
   * @protected
   */
  protected loadLapTimes(selectedRace: RaceSelection) {
    if (
      selectedRace.year &&
      selectedRace.event &&
      selectedRace.session &&
      selectedRace.drivers
    ) {
      this.selectedYear = selectedRace.year;
      this.selectedEvent = selectedRace.event;
      this.selectedSession = selectedRace.session;
      this.driver = selectedRace.drivers[0];

      this.laps.set(undefined);

      this.backendService
        .doGet<LapsResponse>(
          `fast-f1/laps?year=${selectedRace.year}&round=${selectedRace.event?.roundNumber}&session=${selectedRace.session}&driver=${selectedRace.drivers[0]}`,
        )
        .pipe(first((response) => !!response))
        .subscribe({
          next: (response) => {
            this.laps.set(response?.laps ?? []);
          },
        });
    }
  }

  /**
   * Processes the laptime data from the backend
   * @private
   */
  private processData(data: Lap[] | undefined): ProcessedLapTime[] | undefined {
    if (!data) {
      return undefined;
    }

    return data.map((lap) => [
      lap.lapNumber,
      convertToMilliseconds(lap.lapTime),
      lap.tireCompound,
    ]);
  }

  /**
   * Create the options for the laptime scatter chart
   * @private
   */
  private createChartOptions() {
    return {
      title: {
        text: 'Driver Laptimes',
        left: 'center',
      },
      grid: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
        containLabel: true,
      },
      tooltip: {
        show: true,
        formatter: (val: any) => {
          const [lap, time, compound] = val.data;

          return `
            <div class="grid grid-cols-2 gap-x-4">
              <div class="col-span-1 font-bold">Lap: </div><div class="col-span-1">${lap}</div>
              <div class="col-span-1 font-bold">Time: </div><div class="col-span-1">${millisecondsToTimingString(time)}</div>
              <div class="col-span-1 font-bold">Compound: </div><div class="col-span-1">${compound}</div>
            </div>
          `;
        },
      },
      yAxis: {
        type: 'value',
        name: 'Lap Time',
        min: Math.max(this.minLapTime() - 2000, 0),
        axisLabel: {
          formatter: (val: number) => millisecondsToTimingString(val),
        },
      },
      xAxis: {
        type: 'value',
        name: 'Laps',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 100,
          end: 0,
        },
      ],
      visualMap: {
        pieces: this.generateVisualMapPieces(this.tireCompounds()),
        formatter: (value: string) => value,
        backgroundColor: 'lightgrey',
        borderWidth: 1,
        right: 100,
        top: 100,
      },
      series: {
        type: 'scatter',
        data: this.processedData(),
        itemStyle: {
          borderWidth: 1,
          borderColor: 'black',
        },
      },
    };
  }

  private generateVisualMapPieces(compounds: TireCompound[]) {
    return compounds.map((compound) => ({
      value: compound,
      color: TireColors.get(compound),
    }));
  }
}
