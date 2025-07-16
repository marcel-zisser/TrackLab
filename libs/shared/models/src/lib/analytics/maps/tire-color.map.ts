import { TireCompound } from '../enums/tire-compound.enum';

export const TireColors = new Map<TireCompound, string>([
  [TireCompound.Soft, '#EA2F2F'],
  [TireCompound.Medium, '#F7E239'],
  [TireCompound.Hard, '#FFFFFF'],
  [TireCompound.Inter, '#43B047'],
  [TireCompound.Wet, '#0057B8'],
]);
