import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class GrpcService {

  constructor(@Inject('TRACKLAB_PACKAGE') private client: ClientGrpc) {}

  getService<T extends object>(serviceName: string) {
    return this.client.getService<T>(serviceName);
  }
}
