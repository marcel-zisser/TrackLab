import { Injectable } from '@angular/core';
import { SelectionOption } from '@tracklab/models';

@Injectable({
  providedIn: 'root',
})
export class RaceAnalysisService {
  private readonly _years: SelectionOption<string, number>[] = Array.from(
    { length: new Date().getFullYear() - 2018 + 1 },
    (_, i) => 2018 + i,
  )
    .reverse()
    .map((year) => ({ label: `${year}`, value: year }));

  get years(): SelectionOption<string, number>[] {
    return this._years;
  }
}
