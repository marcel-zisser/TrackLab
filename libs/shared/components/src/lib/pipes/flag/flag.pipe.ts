import { Pipe, PipeTransform } from '@angular/core';
import { getCode } from 'country-list';

@Pipe({
  name: 'flag',
})
export class FlagPipe implements PipeTransform {
  transform(country: string | undefined): string {
    if (!country) {
      return '';
    }
    const countryCode = getCode(country);
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`;
  }
}
