import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class LoggingCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(LoggingCacheInterceptor.name);

  async intercept(context: ExecutionContext, next: any) {
    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }

    const cachedResponse = await this.cacheManager.get(key);
    if (cachedResponse) {
      this.logger.log(`Cache HIT for key: ${key}`);
    } else {
      this.logger.log(`Cache MISS for key: ${key}`);
    }

    return super.intercept(context, next);
  }
}
