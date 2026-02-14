import fastf1

from tracklab.analytics.analytics_helpers import map_row_to_lap
from __generated__.copilot_pb2 import QualifyingRequest, QualifyingResult
from __generated__ import copilot_pb2_grpc


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
        return QualifyingResult( prediction=get_segment_data(request) )

