import lightgbm as lgb
import pandas as pd
from pathlib import Path 

class QualifyingPredictor:
    def __init__(self):
        # Load the model

        print(Path.cwd())
        self.q1_model = lgb.Booster(model_file="tracklab/copilot/models/q1_predictor.txt")
        self.q2_model = lgb.Booster(model_file="tracklab/copilot/models/q1_predictor.txt")
        self.q3_model = lgb.Booster(model_file="tracklab/copilot/models/q1_predictor.txt")
    def predict_q1(self, data):
        """
        data dataframe with preprocessed data including everthing until FP3
        """        
        prediction_seconds = self.q1_model.predict(data)

        predictions = {}
        for idx in range(len(prediction_seconds)):
            predictions[data.index[idx]] = prediction_seconds[idx]

        return predictions
    
    def predict_q2(self, data):
        """
        data dataframe with preprocessed data including everthing until Q1
        """
        prediction_seconds = self.q2_model.predict(data)
        return prediction_seconds
    
    def predict_q3(self, data):
        """
        data dataframe with preprocessed data including everthing until Q2
        """
        prediction_seconds = self.q3_model.predict(data)
        return prediction_seconds