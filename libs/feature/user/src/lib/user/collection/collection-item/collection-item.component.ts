import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionItem } from '@tracklab/models';
import { Button } from 'primeng/button';

@Component({
  selector: 'tl-collection-item',
  imports: [CommonModule, Button],
  templateUrl: './collection-item.component.html',
  styleUrl: './collection-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionItemComponent {
  item = input.required<CollectionItem>();
  first = input.required<boolean>();
}
