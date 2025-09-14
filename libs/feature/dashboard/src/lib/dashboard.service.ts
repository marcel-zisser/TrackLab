import { computed, inject, Injectable } from '@angular/core';
import { BackendService } from '@tracklab/services';
import {
  ConstructorStandingsEntry,
  DriverStandingsEntry,
  Event,
  RaceResult,
  StandingsResponse,
} from '@tracklab/models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly backendService = inject(BackendService);

  private eventScheduleResource = this.backendService.doGetResource<Event[]>(
    () => `fast-f1/event-schedule?year=${new Date().getFullYear()}`,
  );
  private standingsResource =
    this.backendService.doGetResource<StandingsResponse>(
      () => 'dashboard/standings',
    );
  private developmentResource = this.backendService.doGetResource<RaceResult[]>(
    () => `fast-f1/session-results?year=${new Date().getFullYear()}`,
  );

  eventSchedule = this.eventScheduleResource.value.asReadonly();
  currentSeason = this.developmentResource.value.asReadonly();

  constructorStandings = computed<ConstructorStandingsEntry[] | undefined>(
    () => this.standingsResource.value()?.constructorStandings?.standingsList,
  );
  driverStandings = computed(() => {
    const standingsMap = new Map<string, DriverStandingsEntry>();

    this.currentSeason()?.forEach((race) => {
      race.results.forEach((result) => {
        const newEntry = {
          driver: result.driver,
          teams: [result.team],
          points: result.points,
          wins: result.position === 1 ? 1 : 0,
          position: result.position,
        } satisfies DriverStandingsEntry;

        if (standingsMap.has(result.driver.code)) {
          const entry = standingsMap.get(result.driver.code) ?? newEntry;
          if (!entry.teams.find((team) => team.id === result.team.id)) {
            entry.teams.push(result.team);
          }
          entry.points += result.points;
          entry.wins += result.position === 1 ? 1 : 0;
        } else {
          standingsMap.set(result.driver.code, newEntry);
        }
      });
    });

    return Array.from(standingsMap.values()).sort(
      (standingA, standingB) => standingB.points - standingA.points,
    );
  });

  /**
   * Computes the stats for the stat spotlight display
   */
  computeStatSpotlights() {
    const winsPerDriver = new Map<string, number>();
    const polesPerDriver = new Map<string, number>();
    const dnfsPerDriver = new Map<string, number>();
    const qualiToRaceDiffPerDriver = new Map<string, number[]>();

    this.currentSeason()?.forEach((raceResult) => {
      raceResult.results.forEach((result) => {
        const driverCode = result.driver.code;
        if (result.position === 1) {
          winsPerDriver.set(
            driverCode,
            (winsPerDriver.get(driverCode) ?? 0) + 1,
          );
        }

        if (result.gridPosition === 1) {
          polesPerDriver.set(
            driverCode,
            (polesPerDriver.get(driverCode) ?? 0) + 1,
          );
        }

        if (result.status !== 'Finished' && !result.status.includes('Lap')) {
          dnfsPerDriver.set(
            driverCode,
            (dnfsPerDriver.get(driverCode) ?? 0) + 1,
          );
        } else {
          dnfsPerDriver.set(driverCode, dnfsPerDriver.get(driverCode) ?? 0);
        }

        if (!qualiToRaceDiffPerDriver.has(driverCode)) {
          qualiToRaceDiffPerDriver.set(driverCode, []);
        }

        const qualiToRaceDiff = result.gridPosition - result.position;
        qualiToRaceDiffPerDriver.get(driverCode)?.push(qualiToRaceDiff);
      });
    });

    const mostWins = this.sortMapDesc(winsPerDriver)[0];
    const mostPoles = this.sortMapDesc(polesPerDriver)[0];
    const sortedDnfs = this.sortMapDesc(dnfsPerDriver);
    const mostDnfs = sortedDnfs[0];
    const leastDnfs = sortedDnfs[sortedDnfs.length - 1];
    const averagedDiffs = this.sortMapDesc(
      this.averageMap(qualiToRaceDiffPerDriver),
    );
    const mostAveragePositionsGained = averagedDiffs[averagedDiffs.length - 1];
    const mostAveragePositionsLost = averagedDiffs[0];

    return [
      {
        category: 'Most wins',
        driver: mostWins?.driver,
        data: mostWins?.data,
      },
      {
        category: 'Most pole-positions',
        driver: mostPoles?.driver,
        data: mostPoles?.data,
      },
      {
        category: 'Most DNFs',
        driver: mostDnfs?.driver,
        data: mostDnfs?.data,
      },
      {
        category: 'Least DNFs',
        driver: leastDnfs?.driver,
        data: leastDnfs?.data,
      },
      {
        category: 'Most avg. positions Gained during Race',
        driver: mostAveragePositionsGained?.driver,
        data: Math.abs(mostAveragePositionsGained?.data),
      },
      {
        category: 'Most avg. positions Lost during Race',
        driver: mostAveragePositionsLost?.driver,
        data: Math.abs(mostAveragePositionsLost?.data),
      },
    ];
  }

  /**
   * Sorts the entries of a map descending and returns it as a sorted array
   */
  private sortMapDesc(map: Map<string, number>) {
    return Array.from(map?.entries())
      .map((entry) => ({ driver: entry[0], data: entry[1] }))
      .sort((entryA, entryB) => entryB.data - entryA.data);
  }

  private averageMap(map: Map<string, number[]>) {
    const averagedMap = new Map<string, number>();
    Array.from(map.entries()).forEach(([driver, values]) => {
      const averagePositionChange =
        values.reduce((a, b) => a + b) / values.length;
      averagedMap.set(driver, Number(averagePositionChange.toFixed(1)));
    });

    return averagedMap;
  }
}
