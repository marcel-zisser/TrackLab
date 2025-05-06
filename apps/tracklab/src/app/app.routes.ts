import { Route } from '@angular/router';
import { ConstructionComponent } from '@tracklab/shared/components';
import { DashboardComponent } from '@tracklab/dashboard';

export const appRoutes: Route[] = [
  {
    title: 'TrackLab',
    path: '',
    component: DashboardComponent,
  },
  {
    title: 'Analytics',
    path: 'analytics',
    component: ConstructionComponent
  },
  {
    title: 'Pitwall Copilot',
    path: 'pitwall-copilot',
    component: ConstructionComponent
  }
];
