import { StandingsEntry } from './standings-entry';
import { Team } from '../base/team';
import { Driver } from '../base/driver';

export interface DriverStandingsEntry extends StandingsEntry {
  driver: Driver;
  teams: Team[];
  points: number;
  wins: number;
}
