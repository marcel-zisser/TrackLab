import { Constructor } from '../constructor';
import { StandingsEntry } from './standings-entry';

export interface ConstructorStandingsEntry extends StandingsEntry {
  Constructor: Constructor;
}
