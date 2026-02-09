import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Column, EventData, SelectionOption } from '@tracklab/models';
import { TableModule } from 'primeng/table';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TracklabStore } from '@tracklab/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RowData {
  position: number;
  driver: string;
  team: string;
  laptime: number;
  s1Time: number;
  s2Time: number;
  s3Time: number;
  tyre: string;
}

type QualifyingTablecolumns = keyof RowData;

@Component({
  selector: 'tl-qualifying-copilot',
  imports: [TableModule, Select, CommonModule, FormsModule],
  providers: [TracklabStore],
  templateUrl: './qualifying-copilot.component.html',
  styleUrl: './qualifying-copilot.component.css',
})
export class QualifyingCopilotComponent implements OnInit {
  private readonly store = inject(TracklabStore);

  protected readonly year = this.store.year;
  protected readonly years: SelectionOption<string, string>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: `${year}`, value: `${year}` }));
  protected readonly events = computed<
    SelectionOption<string, EventData>[] | undefined
  >(() =>
    this.store
      .schedule()
      ?.map((event) => ({ label: event.name, value: event })),
  );

  protected columns: Column[] = [];
  protected readonly rowData = signal<RowData[]>([
    {
      position: 1,
      driver: 'Max Verstappen',
      team: 'Red Bull Racing',
      laptime: 123456,
      s1Time: 123467,
      s2Time: 12346,
      s3Time: 123456,
      tyre: 'Soft',
    },
    {
      position: 2,
      driver: 'Lewis Hamilton',
      team: 'Scuderia Ferrari',
      laptime: 123457,
      s1Time: 123465,
      s2Time: 12348,
      s3Time: 123459,
      tyre: 'Soft',
    },
  ]);

  protected readonly fastest = computed<Map<QualifyingTablecolumns, number>>(
    () => {
      const fastest = new Map<QualifyingTablecolumns, number>();

      fastest.set(
        'laptime',
        this.rowData().sort((a, b) => a.laptime - b.laptime)[0].laptime,
      );
      fastest.set(
        's1Time',
        this.rowData().sort((a, b) => a.s1Time - b.s1Time)[0].s1Time,
      );
      fastest.set(
        's2Time',
        this.rowData().sort((a, b) => a.s2Time - b.s2Time)[0].s2Time,
      );
      fastest.set(
        's3Time',
        this.rowData().sort((a, b) => a.s3Time - b.s3Time)[0].s3Time,
      );

      return fastest;
    },
  );

  constructor() {
    this.store.loadSchedule(this.store.year);
    this.store.loadColors(this.store.eventSelection);
  }

  ngOnInit(): void {
    this.columns = [
      { field: 'position', header: 'Position' },
      { field: 'driver', header: 'Driver' },
      { field: 'team', header: 'Team' },
      { field: 'laptime', header: 'Laptime' },
      { field: 's1Time', header: 'Sector 1' },
      { field: 's2Time', header: 'Sector 2' },
      { field: 's3Time', header: 'Sector 3' },
      { field: 'tyre', header: 'Tyre' },
    ];
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
}
