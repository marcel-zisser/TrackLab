import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { AppTheme } from './app.theme';
import { environment } from '../environments/environment';
import { API_URL_TOKEN } from '@tracklab/services';
import { provideHttpClient } from '@angular/common/http';

import * as echarts from 'echarts/core';
import { provideEchartsCore } from 'ngx-echarts';
import { BarChart, LineChart } from 'echarts/charts';
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

echarts.registerTheme('tracklab-dark', customDark);
echarts.use([
  BarChart,
  LineChart,
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
    provideHttpClient(),
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
