import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CollectionItem } from '@tracklab/models';
import { CollectionItemComponent } from './collection-item/collection-item.component';
import { DataView } from 'primeng/dataview';
import { BackendService } from '@tracklab/services';

@Component({
  selector: 'tl-collection',
  imports: [CollectionItemComponent, DataView],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent implements OnInit {
  private readonly backendService = inject(BackendService);

  protected readonly collection = signal<CollectionItem[]>([]);

  ngOnInit(): void {
    this.backendService
      .doGet<CollectionItem[]>('collection')
      .subscribe((collectionItems) =>
        this.collection.set(collectionItems ?? []),
      );
  }
}
