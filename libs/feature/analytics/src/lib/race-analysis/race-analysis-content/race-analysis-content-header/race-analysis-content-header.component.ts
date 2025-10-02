import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Button } from 'primeng/button';
import { FlagPipe, WeekendFormatPipe } from '@tracklab/shared/components';
import { EventData } from '@tracklab/models';
import { AnalyticsStore } from '../../../store';

@Component({
  selector: 'tl-race-analysis-content-header',
  imports: [
    CommonModule,
    Button,
    FlagPipe,
    NgOptimizedImage,
    WeekendFormatPipe,
  ],
  templateUrl: './race-analysis-content-header.component.html',
  styleUrl: './race-analysis-content-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceAnalysisContentHeaderComponent {
  race = input.required<EventData>();

  private readonly store = inject(AnalyticsStore);

  protected selectedSession: Signal<string | undefined> = this.store.session;

  selectSession(session: string) {
    this.store.updateSession(session);
  }
}
