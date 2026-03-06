import { Inject, Injectable } from '@nestjs/common';
import {
  CopilotClient,
  QualifyingPrediction,
  TrackEvolutionResponse,
} from '../../generated/copilot';
import { GrpcService } from '../grpc/grpc.service';
import { Observable } from 'rxjs';

@Injectable()
export class CopilotService {
  private copilotService: CopilotClient;

  constructor(@Inject() private grpcService: GrpcService) {
    this.copilotService = this.grpcService.getService<CopilotClient>('Copilot');
  }

  /**
   * Generates predictions for a given qualifying segment
   * @param year the year of the session
   * @param round the round of the session
   * @param segmnent the qualifying segment
   */
  getQualifyingPredictions(
    year: number,
    round: number,
    segmnent: string,
  ): Observable<QualifyingPrediction> {
    return this.copilotService.predictQualifyingSegment({
      year: year,
      round: round,
      segment: segmnent,
    });
  }

  /**
   * Retrieves the data for the track evolution for a specific race weekend
   * @param year the year of the session
   * @param round the round of the session
   * @param segmnent the qualifying segment
   */
  getTrackEvolution(
    year: number,
    round: number,
    segmnent: string,
  ): Observable<TrackEvolutionResponse> {
    return this.copilotService.getTrackEvolution({
      year: year,
      round: round,
      segment: segmnent,
    });
  }
}
