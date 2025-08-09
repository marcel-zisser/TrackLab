import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tl-collection',
  imports: [],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {}
