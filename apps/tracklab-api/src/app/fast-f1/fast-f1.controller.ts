import { Controller, Get } from '@nestjs/common';
import { Feature } from '../../generated/route-guide';
import { FastF1Service } from './fast-f1.service';

@Controller('fast-f1')
export class FastF1Controller {
  constructor(private readonly fastF1Service: FastF1Service) {
  }

  @Get('test')
  getFeature(): Promise<Feature> {
    return this.fastF1Service.getFeature();
  }
}
