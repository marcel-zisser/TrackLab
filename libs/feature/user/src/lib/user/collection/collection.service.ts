import { inject, Injectable, Signal, signal } from '@angular/core';
import { BackendService } from '@tracklab/services';
import { CollectionItem } from '@tracklab/models';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly backendService = inject(BackendService);

  private readonly _collection = signal<CollectionItem[]>([]);

  get collection(): Signal<CollectionItem[]> {
    return this._collection.asReadonly();
  }

  constructor() {
    this.backendService
      .doGet<CollectionItem[]>('collection')
      .subscribe((collectionItems) =>
        this._collection.set(collectionItems ?? []),
      );
  }

  updateCollectionItem(item: CollectionItem) {
    this._collection.update((collection) => {
      const copy = cloneDeep(collection);
      const idx = copy.findIndex(
        (collectionItem) => collectionItem.uuid === item.uuid,
      );
      if (idx !== -1) {
        copy[idx] = item;
      }
      return copy;
    });
  }

  removeCollectionItem(item: CollectionItem) {
    this._collection.update((collection) => {
      const copy = cloneDeep(collection);
      return copy.filter((collectionItem) => collectionItem.uuid !== item.uuid);
    });
  }
}
