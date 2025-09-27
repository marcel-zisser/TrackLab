import { Route } from '@angular/router';
import { ConstructionComponent } from '@tracklab/shared/components';
import { DashboardComponent } from '@tracklab/dashboard';
import {
  AnalysisHostComponent,
  AnalysisSelectionComponent,
  AnalyticsComponent,
  ModeSelectionComponent,
  RaceAnalysisComponent,
} from '@tracklab/analytics';
import {
  CollectionComponent,
  SettingsComponent,
  UserComponent,
} from '@tracklab/user';
import { authenticationGuard } from '@tracklab/services';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { AboutComponent } from './about/about.component';
import { AcknowledgementsComponent } from './acknowledgements/acknowledgements.component';

export const appRoutes: Route[] = [
  {
    title: 'TrackLab',
    path: '',
    component: DashboardComponent,
  },
  {
    title: 'About',
    path: 'about',
    component: AboutComponent,
  },
  {
    title: 'Acknowledgements',
    path: 'acknowledgements',
    component: AcknowledgementsComponent,
  },
  {
    title: 'Disclaimer',
    path: 'disclaimer',
    component: DisclaimerComponent,
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    children: [
      {
        title: 'Analytics',
        path: '',
        component: ModeSelectionComponent,
      },
      {
        title: 'Analytics',
        path: 'race',
        component: RaceAnalysisComponent,
      },
      {
        title: 'Custom Analytics',
        path: 'custom',
        component: AnalysisSelectionComponent,
      },
      {
        title: 'Analysis',
        path: 'custom/:type',
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
    children: [
      {
        title: 'Collection',
        path: 'collection',
        canActivate: [authenticationGuard],
        component: CollectionComponent,
      },
      {
        title: 'Settings',
        path: 'settings',
        canActivate: [authenticationGuard],
        component: SettingsComponent,
      },
    ],
  },
];
