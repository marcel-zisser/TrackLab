import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
} from '@angular/core';
import { EventData } from '@tracklab/models';
import { PrimeIcons } from 'primeng/api';
import { FlagPipe } from '@tracklab/shared/components';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { AnalyticsStore } from '../../../store';

@Component({
  selector: 'tl-race-selection-tile',
  templateUrl: './race-selection-tile.component.html',
  styleUrl: './race-selection-tile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlagPipe, NgOptimizedImage, NgClass],
})
export class RaceSelectionTileComponent {
  raceInput = input.required<EventData>();

  private store = inject(AnalyticsStore);

  protected readonly PrimeIcons = PrimeIcons;

  protected selectedRace: Signal<EventData | undefined> = this.store.race;
  protected isFutureRace = computed(
    () => new Date(this.raceInput().date) > new Date(),
  );
  protected isSelectedRace = computed(
    () => this.selectedRace()?.roundNumber === this.raceInput().roundNumber,
  );
}
