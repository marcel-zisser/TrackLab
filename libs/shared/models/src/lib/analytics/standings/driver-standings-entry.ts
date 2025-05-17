import { StandingsEntry } from './standings-entry';
import { Team } from '../team';
import { Driver } from '../driver';

export interface DriverStandingsEntry extends StandingsEntry {
  Driver: Driver;
  Constructors: Team[]
}
