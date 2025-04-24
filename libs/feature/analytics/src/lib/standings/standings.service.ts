import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private driverStandings = [
    {
      position: '1',
      name: 'PIA',
      points: 69,
      team: 'McLaren',
      nationality: 'AUS',
    },
    {
      position: '2',
      name: 'NOR',
      points: 78,
      team: 'McLaren',
      nationality: 'GB',
    },
    {
      position: '3',
      name: 'VER',
      points: 34,
      team: 'Red Bull Racing',
      nationality: 'NED',
    },
  ];

  private constructorStandings = [
    {
      position: '1',
      name: 'McLaren',
      points: 120,
      nationality: 'GB',
    },
    {
      position: '2',
      name: 'Red Bull Racing',
      points: 78,
      nationality: 'AUT',
    },
    {
      position: '3',
      name: 'Ferrari',
      points: 34,
      nationality: 'ITA',
    },
  ];

  getDriverStandings() {
    return this.driverStandings;
  }

  getConstructorStandings() {
    return this.constructorStandings;
  }
}
