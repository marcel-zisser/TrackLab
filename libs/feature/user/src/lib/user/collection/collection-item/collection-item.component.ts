import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionItem, UpdateFavoriteRequest } from '@tracklab/models';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { BackendService } from '@tracklab/services';
import { first } from 'rxjs';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'tl-collection-item',
  imports: [CommonModule, Button],
  templateUrl: './collection-item.component.html',
  styleUrl: './collection-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionItemComponent implements OnInit {
  item = input.required<CollectionItem>();
  first = input.required<boolean>();

  protected readonly PrimeIcons = PrimeIcons;

  private readonly router = inject(Router);
  private readonly backendService = inject(BackendService);
  private readonly collectionService = inject(CollectionService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  readonly elementRef = inject(ElementRef);

  protected thumbnail = signal<string | undefined>(undefined);
  protected isFavorite = computed<boolean>(() => this.item().isFavorite);

  ngOnInit() {
    this.backendService
      .doGetBlob(`collection/thumbnail/${this.item().uuid}`)
      .pipe(first())
      .subscribe({
        next: (blob) => this.thumbnail.set(URL.createObjectURL(blob)),
      });
  }

  /**
   * Opens the analysis of the item
   * @param url
   */
  openAnalysis(url: string) {
    this.router.navigateByUrl(url);
  }

  /**
   * Marks at item as favourite
   * @param uuid the UUID of the item
   * @param isFavorite new favorite state
   */
  favorItem(uuid: string, isFavorite: boolean) {
    this.backendService
      .doPatch<CollectionItem, UpdateFavoriteRequest>('collection/favorite', {
        uuid,
        isFavorite,
      })
      .pipe(first())
      .subscribe((item) => this.collectionService.updateCollectionItem(item));
  }

  /**
   * Deletes an item
   * @param event the click event
   * @param uuid the UUID of the item
   */
  deleteItem(event: Event, uuid: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this item from your collection?',
      header: 'Are you sure',
      icon: PrimeIcons.INFO_CIRCLE,
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.backendService
          .doDelete<CollectionItem>(`collection/${uuid}`)
          .pipe(first())
          .subscribe((item) => {
            this.collectionService.removeCollectionItem(item);
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: 'Collection item deleted',
            });
          });
      },
    });
  }
}
