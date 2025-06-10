import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { AppTheme } from './app.theme';
import { environment } from '../environments/environment';
import { API_URL_TOKEN } from '@tracklab/services';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import * as echarts from 'echarts/core';
import { provideEchartsCore } from 'ngx-echarts';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import customDark from './echarts-theme.json';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

echarts.registerTheme('tracklab-dark', customDark);
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent
]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["example.com"],
          disallowedRoutes: ["http://example.com/examplebadroute/"],
        },
      }),
    ),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AppTheme,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    { provide: API_URL_TOKEN, useValue: environment.apiUrl },
    provideEchartsCore({ echarts }),
  ],
};
