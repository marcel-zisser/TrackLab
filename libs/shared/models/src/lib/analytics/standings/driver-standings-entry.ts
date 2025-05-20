import { StandingsEntry } from './standings-entry';
import { Team } from '../team';
import { Driver } from '../driver';

export interface DriverStandingsEntry extends StandingsEntry {
  driver: Driver;
  teams: Team[];
  points: number;
  wins: number;
}
