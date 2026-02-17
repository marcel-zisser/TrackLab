import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  CopilotQualifyingResponse,
  Duration,
  EventData,
  SelectionOption,
} from '@tracklab/models';
import { TableModule } from 'primeng/table';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TracklabStore } from '@tracklab/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { BackendService } from '@tracklab/services';
import { QualifyingRowData, QualifyingTableComponent } from './qualifying-table/qualifying-table.component';

interface Selection {
  year: number;
  event: EventData;
  segment: string;
}

@Component({
  selector: 'tl-qualifying-copilot',
  imports: [TableModule, Select, CommonModule, FormsModule, QualifyingTableComponent],
  providers: [TracklabStore],
  templateUrl: './qualifying-copilot.component.html',
  styleUrl: './qualifying-copilot.component.css',
})
export class QualifyingCopilotComponent implements OnInit {
  private readonly store = inject(TracklabStore);
  private readonly backendService = inject(BackendService);

  private readonly qualifyingResource = rxResource({
    params: () => this.selection(),
    stream: ({ params }) =>
      this.backendService.doGet<CopilotQualifyingResponse>(
        `copilot/qualifying?year=${params.year}&round=${params.event?.roundNumber}&segment=${params.segment}`,
      ),
  });

  protected segments: SelectionOption<string, string>[] = []
  protected readonly year = this.store.year;
  protected readonly event = this.store.event;
  protected readonly segment = signal<string | undefined>(undefined);

  protected readonly years: SelectionOption<string, string>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: `${year}`, value: `${year}` }));

    protected readonly selection = computed<Selection | undefined>(() => {
    const year = this.store.year();
    const event = this.store.event();
    const segment = this.segment();

    if (year && event && segment) {
      return { year, event, segment };
    }
    return undefined;
  });
  protected readonly events = computed<SelectionOption<string, EventData>[] | undefined>(
    () => this.store.schedule()?.filter(event => new Date(event.date) < new Date()).map((event) => ({ label: event.name, value: event })),
  );

  protected readonly rowData = computed<QualifyingRowData[]>(() => {
    const sortedLaps = this.qualifyingResource
      .value()
      ?.prediction.sort(
        (a, b) => this.durationToNumber(a.lapTime) - this.durationToNumber(b.lapTime),
      );
    const fastestLap = sortedLaps?.[0];

    return (
      sortedLaps?.map((lap, index) => {
        return {
          position: index + 1,
          driver: lap.driver,
          team: lap.team,
          gap:
            this.durationToNumber(lap.lapTime) -
            this.durationToNumber(fastestLap?.lapTime),
          laptime: this.durationToNumber(lap.lapTime),
          s1Time: this.durationToNumber(lap.sector1Time),
          s2Time: this.durationToNumber(lap.sector2Time),
          s3Time: this.durationToNumber(lap.sector3Time),
          tyre: lap.tireCompound,
        } satisfies QualifyingRowData;
      }) ?? []
    );
  });

  constructor() {
    this.store.loadSchedule(this.store.year);
    this.store.loadColors(this.store.eventSelection);
  }

  ngOnInit(): void {
      this.segments = [
      { label: 'Q1', value: 'Q1' },
      { label: 'Q2', value: 'Q2' },
      { label: 'Q3', value: 'Q3' }
    ]
  }

  /**
   * Dispatches the selected year into the store
   * @param event the change event form the year selector
   */
  selectYear(event: SelectChangeEvent) {
    this.store.updateYear(event.value);
    this.store.updateEvent(undefined);
    this.segment.set(undefined);
  }

  /**
   * Dispatches the selected event into the store
   * @param event the change event form the event selector
   */
  selectEvent(event: SelectChangeEvent) {
    this.store.updateEvent(event.value);
    this.segment.set(undefined);
  }

  /**
   * Selectes a qualifying segment
   * @param event the change event form the event selector
   */
  selectSegment(event: SelectChangeEvent) {
    this.segment.set(event.value);
  }

  /**
   * Maps a laptime to a number
   * @param lapTime the laptime to map
   */
  durationToNumber(lapTime?: Duration): number {
    if (!lapTime) {
      return 0;
    }
    return (
      (lapTime.hours ?? 0) * 3600000 +
      (lapTime.minutes ?? 0) * 60000 +
      (lapTime.seconds ?? 0) * 1000 +
      (lapTime.milliseconds ?? 0)
    );
  }
}
