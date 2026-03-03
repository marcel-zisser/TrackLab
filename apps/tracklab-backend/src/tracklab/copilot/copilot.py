import logging
import fastf1
import pandas as pd

from tracklab.analytics.analytics_helpers import map_row_to_lap
from __generated__.copilot_pb2 import QualifyingRequest, QualifyingPrediction, TrackEvolutionResponse
from __generated__ import copilot_pb2_grpc
from tracklab.copilot.qualifying.qualifying_predictor import QualifyingPredictor


def get_segment_data(request: QualifyingRequest):
    """
    Extracts rankings and sector times for a specific segment (Q1, Q2, or Q3)
    """
    # Get all drivers who have a time for this segment in session.results
    # and sort them by that time (ascending)
    session = fastf1.get_session(year=request.year, gp=request.round, identifier='Qualifying')
    session.load(telemetry=False, laps=True, weather=False, messages=False)
    results = session.results

    segment_list = []
    team_palette = {team: fastf1.plotting.get_team_color(team, session=session)
                    for team in results['TeamName'].unique()}
    
    for _, row in results.iterrows():
        driver = row['Abbreviation']
        best_time = row[request.segment]
        
        # Find the specific lap object in session.laps that matches the best time
        # We filter by driver and lap time to ensure we get the correct lap
        driver_laps = session.laps.pick_drivers(driver)
        best_lap = driver_laps[driver_laps['LapTime'] == best_time]

        
        
        if not best_lap.empty:
            lap = best_lap.iloc[0]
            segment_list.append(map_row_to_lap(lap, team_palette))
            
    return segment_list

class CopilotServicer(copilot_pb2_grpc.CopilotServicer):
    def PredictQualifyingSegment(self, request, context):
        predictor = QualifyingPredictor()

        if request.segment == "Q1":
            return QualifyingPrediction(predictions=predictor.predict_q1(request))
        elif request.segment == "Q2":
            return QualifyingPrediction(predictions=predictor.predict_q2(request))
        elif request.segment == "Q3":
            return QualifyingPrediction(predictions=predictor.predict_q3(request))

    
    def GetTrackEvolution(self, request, context):
        event = fastf1.get_event(year=request.year, gp=request.round)

        for i in range(1, 4):
            try: 
                practice = event.get_practice(i)
                practice.load(telemetry=False, laps=True, weather=False, messages=False)
            except:
                logging.info(f"Practice {i} not found for {request.round} in {request.year}")

        return TrackEvolutionResponse(trackEvolution=[])
    