import { Route } from '@angular/router';
import { ConstructionComponent } from '@tracklab/components';

export const appRoutes: Route[] = [
  {
    title: 'TrackLab',
    path: '',
    component: ConstructionComponent,
  },
  {
    title: 'Analyze',
    path: 'analyze',
    component: ConstructionComponent
  },
  {
    title: 'Digital Twin',
    path: 'digital-twin',
    component: ConstructionComponent
  }
];
