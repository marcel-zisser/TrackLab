import { Controller, Get } from '@nestjs/common';
import { FastF1Service } from './fast-f1.service';
import { SessionResultResponse } from '../../generated/results';

@Controller('fast-f1')
export class FastF1Controller {
  constructor(private readonly fastF1Service: FastF1Service) {
  }

  @Get('test')
  getFeature(): Promise<SessionResultResponse> {
    return this.fastF1Service.getSessionResults();
  }
}
