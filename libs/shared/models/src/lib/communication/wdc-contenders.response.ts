import { Driver } from '../analytics';

export interface WdcContender {
  driver: Driver;
  currentPoints: number;
  maxPoints: number;
  canWin: boolean;
  winChance: number;
}

export interface WdcContenderList {
  contenders: WdcContender[];
  roundNumber: number;
}

export type WdcContendersPayload = Record<string, WdcContenderList>;

export interface WdcContendersResponse {
  payload: WdcContendersPayload;
}
