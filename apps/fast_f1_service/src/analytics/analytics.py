import fastf1

from generated.analytics_pb2 import StrategyResponse, StrategyRequest
from generated import analytics_pb2_grpc
from generated.types_pb2 import Strategy


class AnalyticsServicer(analytics_pb2_grpc.AnalyticsServicer):

  def GetSessionStrategy(self, request: StrategyRequest, context):
    response = StrategyResponse()

    session = fastf1.get_session(request.year, request.round, request.session)
    session.load(laps=True, telemetry=False, weather=False, messages=False)

    laps = session.laps

    stints = laps[["Driver", "Stint", "Compound", "LapNumber"]]
    stints = stints.groupby(["Driver", "Stint", "Compound"])
    stints = stints.count().reset_index()

    stints = stints.rename(columns={"LapNumber": "StintLength"})

    for index, row in stints.iterrows():
      response.strategy.append(
        Strategy(
          driver = row['Driver'],
          stint = int(row['Stint']),
          stintLength = row['StintLength'],
          compound=row['Compound']
        )
      )

    return response
