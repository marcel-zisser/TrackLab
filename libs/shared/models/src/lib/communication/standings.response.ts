import { DriverStandingsEntry, ConstructorStandingsEntry, Standings } from '../analytics';

export interface StandingsResponse {
  driverStandings: Standings<DriverStandingsEntry>;
  constructorStandings: Standings<ConstructorStandingsEntry>;
}
