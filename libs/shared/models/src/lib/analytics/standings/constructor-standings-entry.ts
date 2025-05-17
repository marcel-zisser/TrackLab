import { Team } from '../team';
import { StandingsEntry } from './standings-entry';

export interface ConstructorStandingsEntry extends StandingsEntry {
  Constructor: Team;
}
