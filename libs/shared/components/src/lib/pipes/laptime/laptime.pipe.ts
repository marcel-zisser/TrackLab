import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'laptime',
})
export class LaptimePipe implements PipeTransform {
  transform(ms: number): string {
    if (ms === undefined || ms === null || isNaN(ms)) {
    return '--:--.---';
  }

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor(ms % 1000);

  // Pad segments with leading zeros
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  const msStr = milliseconds.toString().padStart(3, '0');

  return `${m}:${s}.${msStr}`;
  }
}
