import logging
from datetime import datetime

import fastf1

from generated import results_pb2_grpc
from generated.results_pb2 import SessionResultResponse
from generated.types_pb2 import DriverResult, SessionResult, Driver, Team


def load_season_results(season: int):
  """
  This function loads the race and sprint results for a given season
  :param season: the season to load the results of
  :return: a list of results ordered by date
  """
  season_results = []
  event_schedule = fastf1.get_event_schedule(season)

  for index in range(len(event_schedule) - 1):
    event = event_schedule.get_event_by_round(index + 1)

    if event.EventFormat == 'sprint_qualifying':
      sprint = event.get_sprint()
      if (sprint.date - datetime.today()).value < 0:
        sprint.load(laps=False, telemetry=False, weather=False, messages=False)
        season_results.append(sprint)

    race = event.get_race()
    if (race.date - datetime.today()).value < 0:
      race.load(laps=False, telemetry=False, weather=False, messages=False)
      season_results.append(race)

  return season_results


def init_session_result(race):
  """
  Initializes the session object with the basic session data
  :param race: the raw race object
  :return: the initializes session results object
  """
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
  """
  Maps the raw result data to proper objects
  :param driver_result_data: the raw data
  :return: The mapped data in proper objects
  """
  return DriverResult(
    driver=Driver(
      id=driver_result_data.get('DriverId'),
      permanentNumber=driver_result_data.get('DriverNumber'),
      code=driver_result_data.get('Abbreviation'),
      givenName=driver_result_data.get('FirstName'),
      familyName=driver_result_data.get('LastName'),
      headshotUrl=driver_result_data.get('HeadshotUrl'),
      countryCode=driver_result_data.get('CountryCode'),
    ),
    team=Team(
      id=driver_result_data.get('TeamId'),
      name=driver_result_data.get('TeamName'),
      color=driver_result_data.get('TeamColor'),
    ),
    position=driver_result_data.get('Position'),
    classifiedPosition=driver_result_data.get('ClassifiedPosition'),
    gridPosition=driver_result_data.get('GridPosition'),
    points=driver_result_data.get('Points'),
    status=driver_result_data.get('Status')
  )


class SessionResultsServicer(results_pb2_grpc.SessionResultsServicer):
  def __init__(self):
    logging.getLogger("fastf1").setLevel(logging.WARNING)

    current_year = datetime.today().year
    self.current_results = load_season_results(current_year)

  def GetSessionResults(self, request, context):
    response = SessionResultResponse()
    current_year = datetime.today().year

    session_results = self.current_results if request.season == current_year else load_season_results(request.season)

    for race in session_results:
      session_result = init_session_result(race)

      for _, row in race.results.iterrows():
        session_result.driverResults.append(map_session_results(row))

      response.sessionResults.append(session_result)

    return response
