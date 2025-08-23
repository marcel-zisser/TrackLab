export interface LapPositionData {
  positions: number[];
  color: string;
  lineStyle: string;
}

export type DriverPositionPayload = Record<string, LapPositionData>;

export interface DriverPositionResponse {
  payload: DriverPositionPayload;
}
