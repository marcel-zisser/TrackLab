import { Component, HostListener, input, viewChild } from '@angular/core';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { Column } from '@tracklab/models';
import { Skeleton } from 'primeng/skeleton';
import { Popover } from 'primeng/popover';
import { DriverCardComponent } from '@tracklab/shared/components';

@Component({
  selector: 'tl-standings',
  imports: [TableModule, Skeleton, Popover, DriverCardComponent],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
})
export class StandingsComponent {
  data = input.required<unknown[] | undefined>();
  columns = input.required<Column[]>();

  popover = viewChild<Popover>('op');
  selectedDriver: never | undefined;
  clickedInside = false;

  displayPopover(event: TableRowSelectEvent) {
      this.popover()?.show(event.originalEvent);

      if (this.popover()?.container) {
        this.popover()?.align();
      }

  }

  onTableClick() {
    this.clickedInside = true;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (!this.clickedInside) {
      this.selectedDriver = undefined;
    }
    this.clickedInside = false;
  }
}
