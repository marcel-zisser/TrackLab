import { ChangeDetectionStrategy, Component, computed, input, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { LaptimePipe } from "@tracklab/components";
import { Column } from '@tracklab/models';

export interface QualifyingRowData {
  position: number;
  driver: string;
  team: string;
  gap: number;
  laptime: number;
  s1Time: number;
  s2Time: number;
  s3Time: number;
  tyre: string;
}

export type QualifyingTableColumns = keyof QualifyingRowData;

@Component({
  selector: 'tl-qualifying-table',
  imports: [TableModule, LaptimePipe],
  templateUrl: './qualifying-table.component.html',
  styleUrl: './qualifying-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QualifyingTableComponent implements OnInit {
  readonly rowData = input.required<QualifyingRowData[]>();

  protected columns: Column[] = [];

  protected readonly fastest = computed<Map<QualifyingTableColumns, number>>(() => {
    const fastest = new Map<QualifyingTableColumns, number>();

    fastest.set(
      'laptime',
      this.rowData().sort((a, b) => a.laptime - b.laptime)[0].laptime,
    );
    fastest.set('s1Time', this.rowData().sort((a, b) => a.s1Time - b.s1Time)[0].s1Time);
    fastest.set('s2Time', this.rowData().sort((a, b) => a.s2Time - b.s2Time)[0].s2Time);
    fastest.set('s3Time', this.rowData().sort((a, b) => a.s3Time - b.s3Time)[0].s3Time);

    return fastest;
  });


  ngOnInit(): void {
    this.columns = [
      { field: 'position', header: 'Position' },
      { field: 'driver', header: 'Driver' },
      { field: 'team', header: 'Team' },
      { field: 'gap', header: 'Gap' },
      { field: 'laptime', header: 'Laptime' },
      { field: 's1Time', header: 'Sector 1' },
      { field: 's2Time', header: 'Sector 2' },
      { field: 's3Time', header: 'Sector 3' },
      { field: 'tyre', header: 'Tyre' },
    ];
  }
  
}
