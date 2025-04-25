import { StandingsEntry } from './standings-entry';

export interface Standings {
  season: string;
  round: string;
  standingsList: StandingsEntry[];
}
