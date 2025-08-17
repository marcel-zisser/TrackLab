import { inject, Injectable, Signal, signal } from '@angular/core';
import { BackendService } from '@tracklab/services';
import { first, firstValueFrom, map, retry } from 'rxjs';
import {
  DriversResponse,
  Event,
  SelectionOption,
  SourceSelectionConfig,
} from '@tracklab/models';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';
import { ECharts } from 'echarts/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateCollectionItemDialogComponent } from '@tracklab/shared/components';

@Injectable({
  providedIn: 'root',
})
export class SourceSelectionService {
  private readonly clipboard = inject(Clipboard);
  private readonly messageService = inject(MessageService);
  private readonly backendService = inject(BackendService);
  private readonly dialogService = inject(DialogService);

  private readonly _chartInstance = signal<ECharts | undefined>(undefined);

  private readonly _years: SelectionOption<string, string>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: `${year}`, value: `${year}` }));
  private readonly _events = signal<SelectionOption<string, Event>[]>([]);
  protected _drivers = signal<string[]>([]);

  get years(): SelectionOption<string, string>[] {
    return this._years;
  }

  get events(): Signal<SelectionOption<string, Event>[]> {
    return this._events.asReadonly();
  }

  get drivers(): Signal<string[]> {
    return this._drivers.asReadonly();
  }

  /**
   * Loads the events of a specific year
   * @param year the year to load the events of
   */
  loadEvents(year: string) {
    this.backendService
      .doGet<Event[]>(`fast-f1/event-schedule?year=${year}`)
      .pipe(
        first((races) => !!races),
        map((races: Event[]) =>
          races.map((race) => ({ label: race.name, value: race })),
        ),
        retry(5),
      )
      .subscribe({
        next: (races) => {
          this._events.set(races);
        },
      });
  }

  setEvents(events: SelectionOption<string, Event>[]) {
    this._events.set(events);
  }

  setChartInstance(ec: ECharts) {
    this._chartInstance.set(ec);
  }

  /**
   * Loads the drivers of a specific session
   * Creates the URL to open a specific analysis
   * @param year the year of the source selection
   * @param event the event of the source selection
   * @param session the session of the source selection
   */
  loadDrivers(year: string, event: Event, session: string | undefined) {
    this.backendService
      .doGet<DriversResponse>(
        `fast-f1/drivers?year=${year}&round=${event.roundNumber}&session=${session}`,
      )
      .pipe(first())
      .subscribe((response) => this._drivers.set(response?.drivers ?? []));
  }

  /**
   * Copies the URL of the analysis to the clipboard
   * @param year the year of the source selection
   * @param event the event of the source selection
   * @param session the session of the source selection
   * @param drivers the selected drivers
   */
  copySourceSelectionToClipboard(
    year: string,
    event: Event,
    session: string | undefined,
    drivers: string[],
  ) {
    const url = this.createUrl(year, event, session, drivers);

    this.clipboard.copy(`${window.location.origin}${url}`);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Link copied to clipboard',
    });
  }

  /**
   * Add a specific analysis to the users collection
   * @param year the year of the source selection
   * @param event the event of the source selection
   * @param session the session of the source selection
   * @param drivers the selected drivers
   */
  async addToCollection(
    year: string,
    event: Event,
    session: string | undefined,
    drivers: string[],
  ) {
    const chartInstance = this._chartInstance();
    if (!chartInstance) {
      return;
    }

    const formData = new FormData();

    const dialogResult = await firstValueFrom(
      this.dialogService.open(CreateCollectionItemDialogComponent, {
        header: 'Create Collection Item',
        closable: true,
        modal: true,
        width: '25%',
      }).onClose,
    );

    const title = dialogResult.title;
    const description = dialogResult.description;
    const url = this.createUrl(year, event, session, drivers);

    const thumbnailUrl = this.createChartSnapshot(chartInstance);
    const res = await fetch(thumbnailUrl ?? '');
    const thumbnail = await res.blob();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('url', url);
    formData.append('thumbnail', thumbnail, 'thumbnail.png');

    this.backendService
      .doPost<never, FormData>('collection', formData)
      .pipe(first())
      .subscribe();
  }

  /**
   * Creates the URL to open a specific analysis
   * @param year the year of the source selection
   * @param event the event of the source selection
   * @param session the session of the source selection
   * @param drivers the selected drivers
   * @private
   */
  private createUrl(
    year: string,
    event: Event,
    session: string | undefined,
    drivers: string[],
  ) {
    const config = {
      year,
      event,
      session,
      drivers,
    } satisfies SourceSelectionConfig;

    const jsonConfig = JSON.stringify(config);
    const encodedConfig = btoa(encodeURIComponent(jsonConfig));
    return `${window.location.pathname}?config=${encodedConfig}`;
  }

  private createChartSnapshot(chartInstance: ECharts) {
    // Save old options, set special options and resize for snapshot
    const oldOption = chartInstance.getOption();
    chartInstance.setOption({
      title: {
        show: false,
      },
      legend: {
        show: false,
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
      visualMap: {
        show: false,
      },
    });
    chartInstance.resize({ width: 504, height: 216 });

    // Take snapshot
    const thumbnailUrl = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 1,
      backgroundColor: '#fff',
    });

    // Reset to original state
    chartInstance.resize({ width: 'auto', height: 'auto' });
    chartInstance.setOption(oldOption);

    return thumbnailUrl;
  }
}
