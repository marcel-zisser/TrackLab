import { Route } from '@angular/router';
import { ConstructionComponent } from '@tracklab/shared/components';
import { DashboardComponent } from '@tracklab/dashboard';
import {
  AnalysisHostComponent,
  AnalysisSelectionComponent,
  AnalyticsComponent,
} from '@tracklab/analytics';
import {
  CollectionComponent,
  SettingsComponent,
  UserComponent,
} from '@tracklab/user';
import { authenticationGuard } from '@tracklab/services';

export const appRoutes: Route[] = [
  {
    title: 'TrackLab',
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    children: [
      {
        title: 'Analytics',
        path: '',
        component: AnalysisSelectionComponent,
      },
      {
        title: 'Analysis',
        path: ':type',
        component: AnalysisHostComponent,
      },
    ],
  },
  {
    title: 'Pitwall Copilot',
    path: 'pitwall-copilot',
    component: ConstructionComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivateChild: [authenticationGuard],
    children: [
      {
        title: 'Collection',
        path: 'collection',
        component: CollectionComponent,
      },
      {
        title: 'Settings',
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];
