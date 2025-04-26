import { StandingsEntry } from './standings-entry';
import { Constructor } from '../constructor';
import { Driver } from '../driver';

export interface DriverStandingsEntry extends StandingsEntry {
  Driver: Driver;
  Constructors: Constructor[]
}
