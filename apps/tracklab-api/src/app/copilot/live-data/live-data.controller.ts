import { Controller, Sse } from '@nestjs/common';
import { LiveDataService } from './live-data.service';
import { map, Observable } from 'rxjs';

@Controller('live-data')
export class LiveDataController {
  constructor(private readonly liveData: LiveDataService) {}

  @Sse()
  stream(): Observable<MessageEvent> {
    return this.liveData.getStream().pipe(
      map((data) => ({
        data,
      })),
    );
  }
}
