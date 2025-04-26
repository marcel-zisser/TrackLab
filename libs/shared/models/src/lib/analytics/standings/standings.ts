import { StandingsEntry } from './standings-entry';

export interface Standings<T extends StandingsEntry> {
  season: string;
  round: string;
  standingsList: T[];
}
