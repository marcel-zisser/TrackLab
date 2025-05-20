import { Component, input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column } from '@tracklab/models';
import { SkeletonTableComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-team-standings',
  imports: [TableModule, SkeletonTableComponent],
  templateUrl: './team-standings.component.html',
  styleUrl: './team-standings.component.css',
})
export class TeamStandingsComponent implements OnInit {

  data = input.required<unknown[] | undefined>();
  constructorColumns: Column[] = [];

  ngOnInit(): void {
    this.constructorColumns = [
      { field: 'position', header: '' },
      { field: 'constructor', header: 'Team' },
      { field: 'points', header: 'Points' },
    ];
  }
}
