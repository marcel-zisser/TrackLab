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
import { NgOptimizedImage } from '@angular/common';
import { RaceAnalysisStore } from '../../store/race-analysis.store';

@Component({
  selector: 'tl-race-selection-tile',
  templateUrl: './race-selection-tile.component.html',
  styleUrl: './race-selection-tile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlagPipe, NgOptimizedImage],
})
export class RaceSelectionTileComponent {
  raceInput = input.required<EventData>();

  private store = inject(RaceAnalysisStore);

  protected readonly PrimeIcons = PrimeIcons;

  protected selectedRace: Signal<EventData | undefined> = this.store.race;
  protected isFutureRace = computed(
    () => new Date(this.raceInput().date) > new Date(),
  );
  protected isSelectedRace = computed(
    () => this.selectedRace()?.roundNumber === this.raceInput().roundNumber,
  );
}
