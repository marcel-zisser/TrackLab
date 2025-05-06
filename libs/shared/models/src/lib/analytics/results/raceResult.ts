import { Circuit } from '../circuit';
import { Result } from './results';

export interface RaceResult {
  season: number;
  round: number;
  date: string;
  time: string;
  type: 'race' | 'sprint';
  circuit: Circuit;
  results: Result[];
}
