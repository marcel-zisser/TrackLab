import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import {
  Event,
  RaceSelection,
  SelectionOption,
  SourceSelectionConfig,
} from '@tracklab/models';
import { first, map, retry } from 'rxjs';
import { BackendService } from '@tracklab/services';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'tl-source-selection',
  imports: [FloatLabel, Select, FormsModule, Button],
  templateUrl: './source-selection.component.html',
  styleUrl: './source-selection.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceSelectionComponent implements OnInit, AfterViewInit {
  withSessionSelection = input<boolean>(true);
  raceSelection = output<RaceSelection>();

  private readonly backendService = inject(BackendService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly clipboard = inject(Clipboard);
  private readonly messageService = inject(MessageService);
  private initialConfig: SourceSelectionConfig | undefined;
  private isInitialized = false;

  protected readonly years: SelectionOption<string, string>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: `${year}`, value: `${year}` }));

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
        ?.sessionInfos?.reverse()
        .map((session) => ({
          label: session.name,
          value: session.name,
        })) ?? [],
  );

  constructor() {
    effect(() => this.createEventScheduleEffect());
    effect(() => this.emitRaceSelectionEffect());
  }

  ngOnInit() {
    const config =
      this.activatedRoute.snapshot.queryParamMap.get('config') ?? '';

    if (config) {
      this.initialConfig = JSON.parse(
        decodeURIComponent(atob(config)),
      ) as SourceSelectionConfig;
      this.year.set(this.initialConfig.year);
    }
  }

  ngAfterViewInit() {
    this.isInitialized = true;

    if (this.initialConfig?.event && this.initialConfig?.session) {
      this.events.set([
        {
          label: this.initialConfig?.event.name,
          value: this.initialConfig?.event,
        },
      ]);
      this.event.set(this.initialConfig?.event);
      this.session.set(this.initialConfig?.session);
    }
  }

  /**
   * Copies the link to the chart into the clipboard.
   */
  protected copyChartLink() {
    const year = this.year();
    const event = this.event();
    const session = this.session();

    if (year && event && (session || !this.withSessionSelection())) {
      const config = {
        year: year,
        event: event,
        session: session,
      } satisfies SourceSelectionConfig;

      const jsonConfig = JSON.stringify(config);
      const encodedConfig = btoa(encodeURIComponent(jsonConfig));

      this.clipboard.copy(
        `${window.location.origin}${window.location.pathname}?config=${encodedConfig}`,
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Link copied to clipboard',
      });
    }
  }

  /**
   * Creates the effect to watch the year, to dynamically load the corresponding races
   * @private
   */
  private createEventScheduleEffect() {
    if (this.year() && this.isInitialized) {
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
          next: (races) => {
            this.events.set(races);
          },
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
