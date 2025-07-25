import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { Event, RaceSelection, SelectionOption } from '@tracklab/models';
import { first, map, retry } from 'rxjs';
import { BackendService } from '@tracklab/services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tl-source-selection',
  imports: [FloatLabel, Select, FormsModule],
  templateUrl: './source-selection.component.html',
  styleUrl: './source-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceSelectionComponent {
  withSessionSelection = input<boolean>(true);
  raceSelection = output<RaceSelection>();

  private readonly backendService = inject(BackendService);

  protected readonly years: SelectionOption<number, number>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: year, value: year }));

  protected readonly year = signal<string | undefined>(undefined);
  protected readonly event = signal<Event | undefined>(undefined);
  protected readonly events = signal<SelectionOption<string, Event>[]>([]);

  protected readonly session = linkedSignal<
    Event | undefined,
    string | undefined
  >({
    source: this.event,
    computation: () => undefined,
  });

  protected readonly sessions = computed<SelectionOption<string, string>[]>(
    () =>
      this.event()
        ?.sessionInfos.reverse()
        .map((session) => ({
          label: session.name,
          value: session.name,
        })) ?? [],
  );

  constructor() {
    effect(() => this.createEventScheduleEffect());
    effect(() => this.emitRaceSelectionEffect());
  }

  /**
   * Creates the effect to watch the year, to dynamically load the corresponding races
   * @private
   */
  private createEventScheduleEffect() {
    if (this.year()) {
      this.event.set(undefined);
      this.session.set(undefined);
      this.backendService
        .doGet<Event[]>(`fast-f1/event-schedule?year=${this.year()}`)
        .pipe(
          first((races) => !!races),
          map((races: Event[]) =>
            races.map((race) => ({ label: race.name, value: race })),
          ),
          retry(5),
        )
        .subscribe({
          next: (races) => this.events.set(races),
        });
    }
  }

  /**
   * Effect to emit the selected values once everything has been selected
   * @private
   */
  private emitRaceSelectionEffect() {
    const year = this.year();
    const event = this.event();
    const session = this.session();

    if (year && event && (session || !this.withSessionSelection())) {
      this.raceSelection.emit({ year, event, session });
    }
  }
}
