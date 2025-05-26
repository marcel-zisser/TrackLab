from generated import results_pb2_grpc
import fastf1
import logging
from datetime import datetime

from generated.results_pb2 import SessionResultResponse
from generated.types_pb2 import DriverResult, SessionResult, Driver, Team


def init_session_result(race):
  session_result = SessionResult()

  session_result.sessionType = race.name
  session_result.eventName = race.event.EventName
  session_result.eventFormat = race.event.EventFormat

  session_result.location.country = race.event.Country
  session_result.location.locality = race.event.Location

  session_result.date = datetime.isoformat(race.date)
  session_result.year = race.event.year

  return session_result


def map_session_results(driver_result_data):
    return DriverResult(
      driver = Driver(
        id = driver_result_data.get('DriverId'),
        permanentNumber = driver_result_data.get('DriverNumber'),
        code = driver_result_data.get('Abbreviation'),
        givenName = driver_result_data.get('FirstName'),
        familyName = driver_result_data.get('LastName'),
        headshotUrl = driver_result_data.get('HeadshotUrl'),
        countryCode = driver_result_data.get('CountryCode'),
      ),
      team = Team(
        id = driver_result_data.get('TeamId'),
        name = driver_result_data.get('TeamName'),
        color = driver_result_data.get('TeamColor'),
      ),
      position = driver_result_data.get('Position'),
      classifiedPosition = driver_result_data.get('ClassifiedPosition'),
      gridPosition = driver_result_data.get('GridPosition'),
      points = driver_result_data.get('Points'),
      status = driver_result_data.get('Status')
    )


class SessionResultsServicer(results_pb2_grpc.SessionResultsServicer):
  def __init__(self):
    logging.getLogger("fastf1").setLevel(logging.WARNING)

    self.currentRaces = []

    current_year = datetime.today().year
    event_schedule = fastf1.get_event_schedule(current_year)

    for index in range(len(event_schedule) - 1):
      event = event_schedule.get_event_by_round(index + 1)

      if (event.EventDate - datetime.today()).value < 0:
        if event.EventFormat == 'sprint_qualifying':
          sprint = event.get_sprint()
          sprint.load(laps=False, telemetry=False, weather=False, messages=False)
          self.currentRaces.append(sprint)

        race = event.get_race()
        race.load(laps=False, telemetry=False, weather=False, messages=False)
        self.currentRaces.append(race)

  def GetSessionResults(self, request, context):
    response = SessionResultResponse()

    for race in self.currentRaces:
      session_result = init_session_result(race)

      for _, row in race.results.iterrows():
        session_result.driverResults.append(map_session_results(row))

      response.sessionResults.append(session_result)

    return response
