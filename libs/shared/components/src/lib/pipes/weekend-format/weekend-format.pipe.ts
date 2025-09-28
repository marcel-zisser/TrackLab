import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekendFormat',
})
export class WeekendFormatPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'conventional':
        return 'Conventional Weekend';
      case 'sprint_qualifying':
        return 'Sprint Weekend';
      default:
        return value;
    }
  }
}
