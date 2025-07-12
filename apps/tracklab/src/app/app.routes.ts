import { Route } from '@angular/router';
import { ConstructionComponent } from '@tracklab/shared/components';
import { DashboardComponent } from '@tracklab/dashboard';
import {
  AnalysisBaseComponent,
  AnalysisSelectionComponent,
  AnalyticsComponent, StrategyComparisonComponent
} from '@tracklab/analytics';
import {
  AnalysisHostComponent
} from '../../../../libs/feature/analytics/src/lib/analysis-host/analysis-host.component';

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
        component: AnalysisSelectionComponent
      },
      {
        title: 'Analysis',
        path: ':type',
        component: AnalysisHostComponent
      }
    ]
  },
  {
    title: 'Pitwall Copilot',
    path: 'pitwall-copilot',
    component: ConstructionComponent
  }
];
