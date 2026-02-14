import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ColorResponse, EventData, EventSelection } from '@tracklab/models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, filter, pipe, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { BackendService } from '@tracklab/services';
import { tapResponse } from '@ngrx/operators';

type AnalyticsState = {
  year: number;
  event: EventData | undefined;
  session: string | undefined;
  schedule: EventData[] | undefined;
  colors: ColorResponse | undefined;
};

const initialState: AnalyticsState = {
  year: new Date().getFullYear(),
  event: undefined,
  session: undefined,
  schedule: undefined,
  colors: undefined,
};

export const TracklabStore = signalStore(
  withState<AnalyticsState>(initialState),
  withComputed(({ year, event: race, session }) => ({
    eventSelection: (): EventSelection | undefined => {
      if (year() && race() && session()) {
        return {
          year: `${year()}`,
          event: race(),
          session: session(),
        } satisfies EventSelection;
      } else {
        return undefined;
      }
    },
  })),
  withMethods((store, backendService = inject(BackendService)) => ({
    updateYear(year: number): void {
      patchState(store, () => ({ year: year }));
      patchState(store, () => ({ event: undefined }));
      patchState(store, () => ({ session: undefined }));
    },
    updateEvent(event: EventData | undefined): void {
      patchState(store, () => ({ event: event }));
      patchState(store, () => ({ session: undefined }));
    },
    updateSession(session: string): void {
      patchState(store, () => ({ session: session }));
    },
    updateEventSelection(selection: EventSelection): void {
      patchState(store, () => ({
        year: Number(selection.year),
        race: selection.event,
        session: selection.session,
      }));
    },
    loadSchedule: rxMethod<number>(
      pipe(
        distinctUntilChanged(),
        switchMap((year) => {
          return backendService
            .doGet<EventData[]>(`analytics/event-schedule?year=${year}`)
            .pipe(
              tapResponse({
                next: (schedule) => patchState(store, { schedule }),
                error: console.error,
              }),
            );
        }),
      ),
    ),
    loadColors: rxMethod<EventSelection | undefined>(
      pipe(
        filter((eventSelection) => !!eventSelection),
        distinctUntilChanged(),
        switchMap((eventSelection) => {
          return backendService
            .doGet<ColorResponse>(
              `analytics/colors?year=${eventSelection.year}&round=${eventSelection.event?.roundNumber}&session=${eventSelection.session}`,
            )
            .pipe(
              tapResponse({
                next: (colorResponse) =>
                  patchState(store, { colors: colorResponse }),
                error: console.error,
              }),
            );
        }),
      ),
    ),
  })),
);
