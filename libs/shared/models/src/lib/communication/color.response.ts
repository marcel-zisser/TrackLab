export type ColorPayload = Record<string, string>;

export interface ColorResponse {
  teamColors: ColorPayload;
  driverColors: ColorPayload;
  driverStyles: ColorPayload;
  compoundStyles: ColorPayload;
}
