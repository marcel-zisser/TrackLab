import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Feature, RouteGuide } from '../../generated/route-guide';

@Injectable()
export class FastF1Service implements OnModuleInit {
  private routeGuideService: RouteGuide;

  constructor(@Inject('ROUTE_GUIDE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.routeGuideService = this.client.getService<RouteGuide>('RouteGuide');
  }

  getFeature(): Promise<Feature> {
    return this.routeGuideService.GetFeature({ latitude: 1, longitude: 2 });
  }
}
