import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { map, Observable } from 'rxjs';

@Controller('copilot/live-data')
export class LiveDataController {
  constructor(private readonly liveData: LiveDataService) {}

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.liveData.getStream().pipe(
      map((data) => ({ data }))
    );
  }
}
