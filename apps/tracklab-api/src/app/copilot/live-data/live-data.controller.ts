import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { map, Observable } from 'rxjs';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('copilot/live-data')
export class LiveDataController {
  constructor(private readonly liveData: LiveDataService) {}

  @Sse('stream')
  @CacheTTL(0.1)
  stream(): Observable<MessageEvent> {
    return this.liveData.getStream().pipe(
      map((data) => ({ data }))
    );
  }
}
