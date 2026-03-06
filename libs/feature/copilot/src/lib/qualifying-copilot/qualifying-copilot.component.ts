import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  Duration,
  SelectionOption,
} from '@tracklab/models';
import { TableModule } from 'primeng/table';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TracklabStore } from '@tracklab/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QualifyingRowData, QualifyingTableComponent } from './qualifying-table/qualifying-table.component';
import { TrackEvolutionChartComponent } from "./track-evolution-chart/track-evolution-chart.component";
import { CopilotService } from '../copilot.service';

@Component({
  selector: 'tl-qualifying-copilot',
  imports: [TableModule, Select, CommonModule, FormsModule, QualifyingTableComponent, TrackEvolutionChartComponent],
  templateUrl: './qualifying-copilot.component.html',
  styleUrl: './qualifying-copilot.component.css',
})
export class QualifyingCopilotComponent implements OnInit {
  private readonly store = inject(TracklabStore);
  private readonly copilotService = inject(CopilotService);

  protected segments: SelectionOption<string, string>[] = []
  protected readonly year = this.store.year;
  protected readonly event = this.store.event;
  protected readonly segment = this.store.segment;

  protected readonly years = this.copilotService.years;
  protected readonly events = this.copilotService.events;
  protected readonly selection = this.copilotService.selection;

  protected readonly rowData = computed<QualifyingRowData[]>(() => {
    const predictions = this.copilotService.qualifyingData()?.predictions;
    predictions?.sort((a, b) => a.time - b.time);

    const bestTime = predictions?.[0].time ?? 0;
    const laps = predictions?.map((prediction, index) => (
      {
        position: index + 1,
        driver: prediction.driver,
        team: prediction.team,
        gap: (prediction.time - bestTime) * 1000,
        laptime: prediction.time * 1000,
        // s1Time: 0,
        // s2Time: 0,
        // s3Time: 0,
        // tyre: 'SOFT'
      } satisfies QualifyingRowData
    ));
   
    return laps ?? [];
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
  }

  /**
   * Dispatches the selected event into the store
   * @param event the change event form the event selector
   */
  selectEvent(event: SelectChangeEvent) {
    this.store.updateEvent(event.value);
  }

  /**
   * Selectes a qualifying segment
   * @param event the change event form the event selector
   */
  selectSegment(event: SelectChangeEvent) {
    this.store.updateSegment(event.value);
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
