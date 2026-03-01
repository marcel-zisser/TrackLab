import { Controller, Get, Query } from '@nestjs/common';
import { CopilotService } from './copilot.service';
import { QualifyingPrediction } from '../../generated/copilot';
import { Observable } from 'rxjs';

@Controller('copilot')
export class CopilotController {
    constructor(private readonly copilotService: CopilotService){}

    @Get('qualifying')
    getPredictions(
        @Query('year') year: number,
        @Query('round') round: number,
        @Query('segment') segment: string,
    ): Observable<QualifyingPrediction> {
        return this.copilotService.getQualifyingPredictions(year, round, segment);
    }
}
