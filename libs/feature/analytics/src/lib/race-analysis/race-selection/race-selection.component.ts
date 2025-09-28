import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { Divider } from 'primeng/divider';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Select } from 'primeng/select';
import { RaceAnalysisService } from '../race-analysis.service';
import { RaceAnalysisStore } from '../store/race-analysis.store';
import { EventData } from '@tracklab/models';
import { FormsModule } from '@angular/forms';
import { RaceSelectionTileComponent } from './race-selection-tile/race-selection-tile.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'tl-race-selection',
  imports: [
    Divider,
    ProgressSpinner,
    Select,
    FormsModule,
    RaceSelectionTileComponent,
  ],
  templateUrl: './race-selection.component.html',
  styleUrl: './race-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceSelectionComponent {
  private readonly raceAnalysisService = inject(RaceAnalysisService);
  private readonly store = inject(RaceAnalysisStore);
  private readonly messageService = inject(MessageService);

  protected readonly years = this.raceAnalysisService.years;
  protected readonly year = this.store.year;
  protected readonly schedule: Signal<EventData[] | undefined> =
    this.store.schedule;

  constructor() {
    // Dynamically loads the schedule every time the year is changed
    this.store.loadSchedule(this.store.year);
  }

  setYear(year: number) {
    this.store.updateYear(year);
  }

  chooseRace(race: EventData): void {
    if (new Date(race.date) > new Date()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Cannot open future race',
        detail:
          'The selected race is in the future and therefore no analysis is yet available.',
      });
      return;
    }

    this.store.updateRace(race);
  }
}
