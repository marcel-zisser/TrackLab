import { TireCompound } from '../enums/tire-compound.enum';

export const TireColors = new Map<TireCompound, string>([
  [TireCompound.Hypersoft, '#F596BF'],
  [TireCompound.Ultrasoft, '#B131AF'],
  [TireCompound.Supersoft, '#FF0000'],
  [TireCompound.Soft, '#EA2F2F'],
  [TireCompound.Medium, '#F7E239'],
  [TireCompound.Hard, '#FFFFFF'],
  [TireCompound.Superhard, '#F47920'],
  [TireCompound.Inter, '#43B047'],
  [TireCompound.Wet, '#0057B8'],
]);
