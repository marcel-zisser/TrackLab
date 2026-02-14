import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DataPoint, LiveDataClient } from '../../../generated/copilot';
import { Subject } from 'rxjs';
import { GrpcService } from '../../grpc/grpc.service';

@Injectable()
export class LiveDataService implements OnModuleInit{
  private liveDataService: LiveDataClient;
  private stream$ = new Subject<DataPoint>();

  constructor(@Inject() private grpcService: GrpcService) {
    this.liveDataService = this.grpcService.getService<LiveDataClient>('LiveData');
  }

  onModuleInit() {
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
