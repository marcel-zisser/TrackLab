from generated import results_pb2_grpc
import fastf1
import logging
from datetime import datetime

from generated.results_pb2 import SessionResultResponse
from generated.types_pb2 import DriverResult, SessionResult


class SessionResultsServicer(results_pb2_grpc.SessionResultsServicer):
  """Provides methods that implement functionality of route guide server."""

  def __init__(self):
    logging.getLogger("fastf1").setLevel(logging.WARNING)

    self.currentRaces = []

    current_year = datetime.today().year
    event_schedule = fastf1.get_event_schedule(current_year)

    for index in range(len(event_schedule) - 1):
      event = event_schedule.get_event_by_round(index + 1)

      if (event.EventDate - datetime.today()).value < 0:
        race = event.get_race()
        race.load(laps=False, telemetry=False, weather=False, messages=False)
        self.currentRaces.append(race)

  def GetSessionResults(self, request, context):
    response = SessionResultResponse()

    for race in self.currentRaces:
      session_result = SessionResult()
      for _, row in race.results.iterrows():
        driver_result = DriverResult(
          driverNumber = row.get('DriverNumber'),
          driverId = row.get('DriverId'),
          code = row.get('Abbreviation'),
          givenName = row.get('FirstName'),
          familyName = row.get('LastName'),
          headshotUrl = row.get('HeadshotUrl'),
          countryCode = row.get('Countrycode'),

          teamId = row.get('TeamId'),
          teamName = row.get('TeamName'),
          teamColor = row.get('TeamColor'),

          position = row.get('Position'),
          classifiedPosition = row.get('ClassifiedPosition'),
          gridPosition = row.get('GridPosition'),

          status = row.get('Status'),
          points = row.get('Points')
        )
        session_result.driverResults.append(driver_result)
      response.results.append(session_result)

    return response
