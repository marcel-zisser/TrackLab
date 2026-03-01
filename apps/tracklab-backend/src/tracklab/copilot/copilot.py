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


def get_data_for_prediction(year, round):

    event = fastf1.get_event(year, round)
    all_session_data = []
    weather_summary = {}

    # Loop through all practice sessions
    for sessionName in ['fp1', 'fp2', 'fp3']:
        try: 
            session = event.get_session(sessionName)
        except: 
            continue

        session.load(telemetry=False, laps=True, weather=True, messages=False)
        laps = session.laps
        laps['LapTime'] = pd.to_timedelta(laps['LapTime'])

        laps = laps.groupby('Driver')['LapTime'].min().reset_index()
        laps['session'] = sessionName
        weather = session.weather_data
        
        weather_summary[f'air_temp_{sessionName}'] = weather['AirTemp'].mean()
        weather_summary[f'track_temp_{sessionName}'] = weather['TrackTemp'].mean()
        weather_summary[f'humidity_{sessionName}'] = weather['Humidity'].mean()
        weather_summary[f'wind_speed_{sessionName}'] = weather['WindSpeed'].mean()
        weather_summary[f'rainfall_{sessionName}'] = weather['Rainfall'].mean()

        all_session_data.append(laps)

    # Extract data from qualifying segments
    qualifying = event.get_session('q')
    qualifying.load(telemetry=False, laps=True, weather=True, messages=False)

    weather = session.weather_data
    
    weather_summary[f'air_temp_q'] = weather['AirTemp'].mean()
    weather_summary[f'track_temp_q'] = weather['TrackTemp'].mean()
    weather_summary[f'humidity_q'] = weather['Humidity'].mean()
    weather_summary[f'wind_speed_q'] = weather['WindSpeed'].mean()
    weather_summary[f'rainfall_q'] = weather['Rainfall'].mean()

    # Combine all sessions
    final_df = pd.concat(all_session_data, ignore_index=True)
    final_df = final_df.pivot(index='Driver', columns='session', values='LapTime')
    final_df['driver'] = final_df.index
    final_df['track'] = event.Location

    for col_name, value in weather_summary.items():
        final_df[col_name] = value

    
    final_df['driver'] = final_df['driver'].astype('category')
    final_df['track'] = final_df['track'].astype('category')

    final_df['fp1'] = final_df['fp1'].dt.total_seconds()
    final_df['fp2'] = final_df['fp2'].dt.total_seconds()
    final_df['fp3'] = final_df['fp3'].dt.total_seconds()

    mean_fp1 = final_df['fp1'].mean()
    final_df.fillna(value={'fp1': mean_fp1},  inplace=True)
    final_df['fp2'] = final_df['fp2'].fillna(final_df['fp1'])
    final_df['fp3'] = final_df['fp3'].fillna(final_df['fp2'])

    return final_df

class CopilotServicer(copilot_pb2_grpc.CopilotServicer):
    def PredictQualifyingSegment(self, request, context):
        predictor = QualifyingPredictor()
        data = get_data_for_prediction(request.year, request.round)
        predictions = predictor.predict_q1(data)

        return QualifyingPrediction(predictions=predictions)
    
    def GetTrackEvolution(self, request, context):
        event = fastf1.get_event(year=request.year, gp=request.round)

        for i in range(1, 4):
            try: 
                practice = event.get_practice(i)
                practice.load(telemetry=False, laps=True, weather=False, messages=False)
            except:
                logging.info(f"Practice {i} not found for {request.round} in {request.year}")

        return TrackEvolutionResponse(trackEvolution=[])
    