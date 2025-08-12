import { Controller, UseInterceptors } from '@nestjs/common';
import { LoggingCacheInterceptor } from './interceptors/cache-logging.interceptor';

@UseInterceptors(LoggingCacheInterceptor)
@Controller()
export class AppController {}
