import { Standings } from '../../analytics/standings/standings';

export interface StandingsResponse {
  driverStandings: Standings;
  constructorStandings: Standings;
}
