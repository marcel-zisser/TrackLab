import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CollectionItemComponent } from './collection-item/collection-item.component';
import { DataView } from 'primeng/dataview';
import { CollectionService } from './collection.service';
import { CollectionItem, SelectionOption } from '@tracklab/models';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';

@Component({
  selector: 'tl-collection',
  imports: [
    CollectionItemComponent,
    DataView,
    FormsModule,
    InputText,
    SelectButton,
    InputIcon,
    IconField,
  ],
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
  protected readonly onlyFavorites = signal<boolean>(false);
  protected readonly collection = this.collectionService.collection;
  protected readonly favoriteItems = computed<CollectionItem[]>(() =>
    this.collection().filter((item) => item.isFavorite),
  );

  protected favoriteOptions: SelectionOption<string, boolean>[] = [
    { label: 'All', value: false },
    {
      label: 'Favorites',
      value: true,
    },
  ];

  ngAfterViewInit(): void {
    const observer = new ResizeObserver(() => {
      const itemHeight =
        this.itemElementRefs()?.[0]?.elementRef.nativeElement.offsetHeight;
      const dataViewHeight = this.dataView().el.nativeElement.offsetHeight;
      const headerHeight =
        this.dataView().el.nativeElement.children.item(0).offsetHeight;
      const paginatorHeight =
        this.dataView().el.nativeElement.children.item(2).offsetHeight;
      const gapHeight = 16;

      const itemsPerPage = Math.floor(
        (dataViewHeight - headerHeight - paginatorHeight) /
          (itemHeight + gapHeight),
      );
      if (itemsPerPage > 0) {
        this.dataViewRows.set(itemsPerPage);
      }
    });

    observer.observe(this.dataView().el.nativeElement);
    this.dataView().filterService.register(
      'isFavorite',
      (value: CollectionItem) => {
        if (value === undefined || value === null) {
          return false;
        }

        return value.isFavorite;
      },
    );
  }

  filterDataView(target: EventTarget | null) {
    this.dataView().filter((target as HTMLInputElement)?.value ?? '');
  }
}
