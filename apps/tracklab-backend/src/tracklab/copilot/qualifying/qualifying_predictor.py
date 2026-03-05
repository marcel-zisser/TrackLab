from __generated__.copilot_pb2 import Prediction
import fastf1
import lightgbm as lgb
import pandas as pd
from pathlib import Path 

def get_data_for_prediction(year, round, segment):

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
        best_lap_indices = laps.groupby('Driver')['LapTime'].idxmin().dropna()

        laps = laps.loc[best_lap_indices][['Driver', 'Team', 'LapTime']].rename(columns={'Team': 'team', 'Driver': 'driver'}).reset_index(drop=True)
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

    results = qualifying.results
    results['Q1'] = pd.to_timedelta(results['Q1'])
    results['Q2'] = pd.to_timedelta(results['Q2'])
    results['Q3'] = pd.to_timedelta(results['Q3'])

    segments = []
    if segment == 'Q1':
        segments = []
    elif segment == 'Q2':
        segments = ['q1']
    elif segment == 'Q3':
        segments = ['q1', 'q2']

    for qualifyingSegment in segments:
        df = results.rename(columns={'Abbreviation': 'driver', 'TeamName': 'team', qualifyingSegment.upper(): 'LapTime'}, inplace=False)
        df = df[['driver', 'team', 'LapTime']]
        df['session'] = qualifyingSegment
        
        all_session_data.append(df)

    weather = qualifying.weather_data

    weather_summary[f'air_temp_q'] = weather['AirTemp'].mean()
    weather_summary[f'track_temp_q'] = weather['TrackTemp'].mean()
    weather_summary[f'humidity_q'] = weather['Humidity'].mean()
    weather_summary[f'wind_speed_q'] = weather['WindSpeed'].mean()
    weather_summary[f'rainfall_q'] = weather['Rainfall'].mean()

    # Combine all sessions
    final_df = pd.concat(all_session_data, ignore_index=True)
    final_df = final_df.pivot(index=['driver', 'team'], columns='session', values='LapTime').reset_index().set_index('driver', drop=False)
    final_df['track'] = event.Location

    for col_name, value in weather_summary.items():
        final_df[col_name] = value
    
    final_df['driver'] = final_df['driver'].astype('category')
    final_df['track'] = final_df['track'].astype('category')
    final_df['team'] = final_df['team'].astype('category')

    final_df['fp1'] = final_df['fp1'].dt.total_seconds()
    final_df['fp2'] = final_df['fp2'].dt.total_seconds()
    final_df['fp3'] = final_df['fp3'].dt.total_seconds()

    if 'q2' in final_df.columns:
        final_df['q1'] = final_df['q1'].dt.total_seconds()

    if 'q3' in final_df.columns:
        final_df['q2'] = final_df['q2'].dt.total_seconds()

    mean_fp1 = final_df['fp1'].mean()
    final_df.fillna(value={'fp1': mean_fp1},  inplace=True)
    final_df['fp2'] = final_df['fp2'].fillna(final_df['fp1'])
    final_df['fp3'] = final_df['fp3'].fillna(final_df['fp2'])

    return final_df


def map_predictions(data, predicted_seconds):
    predictions = []
    
    for idx in range(len(predicted_seconds)):
        predictions.append(Prediction(driver=data.index[idx], team=data.iloc[idx]['team'], time=predicted_seconds[idx]))

    return predictions


class QualifyingPredictor:
    def __init__(self):
        # Load the model
        self.q1_model = lgb.Booster(model_file="tracklab/copilot/models/q1_predictor.txt")
        self.q2_model = lgb.Booster(model_file="tracklab/copilot/models/q2_predictor.txt")
        self.q3_model = lgb.Booster(model_file="tracklab/copilot/models/q3_predictor.txt")


    def predict_q1(self, request):
        """
        data dataframe with preprocessed data including everthing until FP3
        """        
        data = get_data_for_prediction(request.year, request.round, request.segment)
        prediction_seconds = self.q1_model.predict(data)

        return map_predictions(data, prediction_seconds)
    
    
    def predict_q2(self, request):
        """
        data dataframe with preprocessed data including everthing until Q1
        """
        data = get_data_for_prediction(request.year, request.round, request.segment)
        data = data.nsmallest(15, 'q1')
        prediction_seconds = self.q2_model.predict(data)

        return map_predictions(data, prediction_seconds)
    
    
    def predict_q3(self, request):
        """
        data dataframe with preprocessed data including everthing until Q2
        """
        data = get_data_for_prediction(request.year, request.round, request.segment)
        data = data.nsmallest(10, 'q2')
        prediction_seconds = self.q3_model.predict(data)

        return map_predictions(data, prediction_seconds)
    