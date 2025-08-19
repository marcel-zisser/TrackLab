import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CollectionItemComponent } from './collection-item/collection-item.component';
import { DataView } from 'primeng/dataview';
import { CollectionService } from './collection.service';

@Component({
  selector: 'tl-collection',
  imports: [CollectionItemComponent, DataView],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent implements AfterViewInit {
  private readonly dataView = viewChild.required<DataView>('dataView');
  private readonly itemElementRefs =
    viewChildren<CollectionItemComponent>('item');

  private readonly collectionService = inject(CollectionService);

  protected readonly dataViewRows = signal<number>(4);
  protected readonly collection = this.collectionService.collection;

  ngAfterViewInit(): void {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        const itemHeight =
          this.itemElementRefs()?.[0]?.elementRef.nativeElement.offsetHeight;
        const dataViewHeight = this.dataView().el.nativeElement.offsetHeight;
        const paginatorHeight =
          this.dataView().el.nativeElement.children.item(1).offsetHeight;
        const gapHeight = 16;

        const itemsPerPage = Math.floor(
          (dataViewHeight - paginatorHeight) / (itemHeight + gapHeight),
        );
        if (itemsPerPage > 0) {
          this.dataViewRows.set(itemsPerPage);
        }
      });
    });

    observer.observe(this.dataView().el.nativeElement);
  }
}
