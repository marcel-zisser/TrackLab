export interface LapPositionData {
  positions: number[];
}

export type DriverPositionPayload = Record<string, LapPositionData>;

export interface DriverPositionResponse {
  payload: DriverPositionPayload;
}
