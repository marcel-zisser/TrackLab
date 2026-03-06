import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CopilotQualifyingResponse, SelectionOption, EventData, TrackEvolutionResponse } from '@tracklab/models';
import { BackendService } from '@tracklab/services';
import { TracklabStore } from '@tracklab/store';

export interface Selection {
  year: number;
  event: EventData;
  segment: string;
}

@Injectable()
export class CopilotService {
  private readonly backendService = inject(BackendService);
  private readonly store = inject(TracklabStore);

  private readonly qualifyingResource = rxResource({
    params: () => this.selection(),
    stream: ({ params }) =>
      this.backendService.doGet<CopilotQualifyingResponse>(
        `copilot/qualifying?year=${params.year}&round=${params.event?.roundNumber}&segment=${params.segment}`,
      ),
  });

  private readonly trackEvolutionResource = rxResource({
    params: () => this.selection(),
    stream: ({ params }) =>
      this.backendService.doGet<TrackEvolutionResponse>(
        `copilot/track-evolution?year=${params.year}&round=${params.event?.roundNumber}&segment=${params.segment}`,
      ),
  });

  readonly years: SelectionOption<string, string>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: `${year}`, value: `${year}` }));

  readonly selection = computed<Selection | undefined>(() => {
    const year = this.store.year();
    const event = this.store.event();
    const segment = this.store.segment();

    if (year && event && segment) {
      return { year, event, segment };
    }
    return undefined;
  });

  readonly events = computed<SelectionOption<string, EventData>[] | undefined>(() =>
    this.store
      .schedule()
      ?.filter((event) => new Date(event.sessionInfos?.[2].date ?? '') < new Date())
      .map((event) => ({ label: event.name, value: event })),
  );

  qualifyingData = this.qualifyingResource.asReadonly().value;
  trackEvolution = this.trackEvolutionResource.asReadonly().value;
}
