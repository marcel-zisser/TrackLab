import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { DataPoint, LiveDataClient } from '../../../generated/copilot';
import { Subject } from 'rxjs';

@Injectable()
export class LiveDataService {
  private liveDataService: LiveDataClient;
  private stream$ = new Subject<DataPoint>();

  constructor(@Inject('TRACKLAB_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.liveDataService = this.client.getService<LiveDataClient>('LiveData');

    this.liveDataService.streamData({}).subscribe({
      next: data => this.stream$.next(data),
      error: err => this.stream$.error(err),
      complete: () => this.stream$.complete()
    });
  }

  getStream() {
    return this.stream$.asObservable();
  }
}
