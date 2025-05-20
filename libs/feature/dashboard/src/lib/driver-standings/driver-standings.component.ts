import { Component, computed, HostListener, input, OnInit, signal, viewChild } from '@angular/core';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { Column, DriverInfo, DriverStandingsEntry } from '@tracklab/models';
import { Popover } from 'primeng/popover';
import { DriverCardComponent, SkeletonTableComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-driver-standings',
  imports: [
    TableModule,
    Popover,
    DriverCardComponent,
    SkeletonTableComponent,
  ],
  templateUrl: './driver-standings.component.html',
  styleUrl: './driver-standings.component.css',
})
export class DriverStandingsComponent implements OnInit {
  data = input.required<DriverStandingsEntry[]>();
  protected popover = viewChild<Popover>('op');

  protected driverRows = computed( () =>
    this.data().map((entry, idx) => ({
      position: idx + 1,
      driver: entry.driver.code,
      team: entry.teams[entry.teams.length - 1].name,
      wins: entry.wins,
      points: entry.points,
    }))
  );
  protected popoverData = signal<DriverInfo | null>(null);

  driverColumns: Column[] = [];
  selectedDriver: never | undefined;
  clickedInside = false;

  ngOnInit(): void {
    this.driverColumns = [
      { field: 'position', header: '' },
      { field: 'driver', header: 'Driver' },
      { field: 'team', header: 'Team' },
      { field: 'wins', header: 'Wins' },
      { field: 'points', header: 'Points' },
    ];
  }

  displayPopover(event: TableRowSelectEvent) {
    const entry = this.data()[event.data.position - 1];
    this.popoverData.set({
      driver: entry.driver,
      team: entry.teams[entry.teams.length - 1],
      wins: entry.wins,
      points: entry.points,
    });
    this.popover()?.show(event.originalEvent);

    if (this.popover()?.container) {
      this.popover()?.align();
    }
  }

  onTableClick() {
    this.clickedInside = true;
  }

  @HostListener('document:click', ['$event'])
  handleClick() {
    if (!this.clickedInside) {
      this.selectedDriver = undefined;
    }
    this.clickedInside = false;
  }
}
