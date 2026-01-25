import { Duration } from '../analytics';

export interface LeaderGapData {
  gaps: Duration[];
}

export type LeaderGapPayload = Record<string, LeaderGapData>;

export interface LeaderGapResponse {
  payload: LeaderGapPayload;
}
