import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
export class CollectionComponent {
  private readonly collectionService = inject(CollectionService);

  protected readonly collection = this.collectionService.collection;
}
