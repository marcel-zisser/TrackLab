import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SessionResultResponse, SessionResults } from '../../generated/results';

@Injectable()
export class FastF1Service implements OnModuleInit {
  private routeGuideService: SessionResults;

  constructor(@Inject('TRACKLAB_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.routeGuideService = this.client.getService<SessionResults>('SessionResults');
  }

  getSessionResults(): Promise<SessionResultResponse> {
    return this.routeGuideService.GetSessionResults({ season: '2025' });
  }
}
