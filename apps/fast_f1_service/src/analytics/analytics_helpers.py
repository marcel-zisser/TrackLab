import fastf1
import fastf1.plotting
from fastf1.ergast import Ergast
from pandas import NaT

from generated.types_pb2 import Lap, Duration, ChampionshipContender, Driver


def map_row_to_lap(row, team_palette):
  """
  Maps a dataframe row to a lap object
  :param row: the row to map
  :param team_palette: the team color palette needed for coloration of the charts
  :return: a Lap object containing the rows information
  """
  time = row.Time
  lap_time = row.LapTime
  pit_in_time = row.PitInTime
  pit_out_time = row.PitOutTime
  sector1_time = row.Sector1Time
  sector2_time = row.Sector2Time
  sector3_time = row.Sector3Time

  return Lap(
    time=Duration(
      hours=time.components.hours,
      minutes=time.components.minutes,
      seconds=time.components.seconds,
      milliseconds=time.components.milliseconds
    ) if time is not NaT else Duration(),
    driver=row.Driver,
    driverNumber=int(row.DriverNumber),
    team=row.Team,
    teamColor=team_palette[row.Team],
    lapTime=Duration(
      hours=lap_time.components.hours,
      minutes=lap_time.components.minutes,
      seconds=lap_time.components.seconds,
      milliseconds=lap_time.components.milliseconds
    ) if lap_time is not NaT else Duration(),
    lapNumber=int(row.LapNumber),
    stint=int(row.Stint),
    pitOutTime=Duration(
      hours=pit_out_time.components.hours,
      minutes=pit_out_time.components.minutes,
      seconds=pit_out_time.components.seconds,
      milliseconds=pit_out_time.components.milliseconds
    ) if pit_out_time is not NaT else Duration(),
    pitInTime=Duration(
      hours=pit_in_time.components.hours,
      minutes=pit_in_time.components.minutes,
      seconds=pit_in_time.components.seconds,
      milliseconds=pit_in_time.components.milliseconds
    ) if pit_in_time is not NaT else Duration(),
    sector1Time=Duration(
      hours=sector1_time.components.hours,
      minutes=sector1_time.components.minutes,
      seconds=sector1_time.components.seconds,
      milliseconds=sector1_time.components.milliseconds
    ) if sector1_time is not NaT else Duration(),
    sector2Time=Duration(
      hours=sector2_time.components.hours,
      minutes=sector2_time.components.minutes,
      seconds=sector2_time.components.seconds,
      milliseconds=sector2_time.components.milliseconds
    ) if sector2_time is not NaT else Duration(),
    sector3Time=Duration(
      hours=sector3_time.components.hours,
      minutes=sector3_time.components.minutes,
      seconds=sector3_time.components.seconds,
      milliseconds=sector3_time.components.milliseconds
    ) if sector3_time is not NaT else Duration(),
    speedI1=float(row.SpeedI1),
    speedI2=float(row.SpeedI2),
    speedFL=float(row.SpeedFL),
    speedST=float(row.SpeedST),
    isPersonalBest=bool(row.IsPersonalBest),
    tireCompound=row.Compound,
    tireLife=int(row.TyreLife),
    freshTire=bool(row.FreshTyre),
    trackStatus=int(row.TrackStatus),
    position=int(row.Position),
    deleted=bool(row.Deleted),
    deletedReason=row.DeletedReason
  )


def get_drivers_standings(season, round):
  """
  Retrieves the driver standings for a specific season and round
  :param season: the desired season
  :param round: the desired round
  :return: the driver standings
  """
  ergast = Ergast()
  standings = ergast.get_driver_standings(season=season, round=round)
  return standings.content[0]


def calculate_max_points_for_remaining_season(season, round):
  """
  Calculates the maximum amount of points drivers can achieve during the current season
  :param season: the desired season
  :param round: the desired round
  :return: Maximum amount of points the drivers can achieve
  """
  points_for_sprint = 8  # Winning the sprint and race
  points_for_conventional = 25  # Winning the race

  events = fastf1.events.get_event_schedule(season, backend='ergast')
  events = events[events['RoundNumber'] > round]
  # Count how many sprints and conventional races are left
  sprint_events = len(events.loc[events["EventFormat"] == "sprint_qualifying"])
  conventional_events = len(events.loc[events["EventFormat"] == "conventional"])

  # Calculate points for each
  sprint_points = sprint_events * points_for_sprint
  conventional_points = conventional_events * points_for_conventional

  return sprint_points + conventional_points


def calculate_who_can_win(driver_standings, max_points):
  """
  Calculates which driver can theoretically still win the WDC
  :param driver_standings: the current driver standings
  :param max_points: the maximum amount of points the drivers can achieve
  :return: the drivers annotated with who can still become WDC
  """
  leader_points = int(driver_standings.loc[0]['points'])
  ret_val = []

  for driver in driver_standings.itertuples():
    driver_max_points = driver.points + max_points
    can_win = False if driver_max_points < leader_points else True

    ret_val.append(ChampionshipContender(
      driver=Driver(
        id=driver.driverId,
        code=driver.driverCode,
        givenName=driver.givenName,
        familyName=driver.familyName,
        permanentNumber=str(driver.driverNumber),
        nationality=driver.driverNationality,
      ),
      currentPoints=driver.points,
      maxPoints=driver_max_points,
      canWin=can_win,
      winChance=0.0
    ))

  return ret_val


def get_driver_plot_style(driver, session):
  """
  Retrieves the line style for a driver in a given session. It gets color and line style.
  :param driver: the identifier for a driver (e.g. NOR, HAM or VER)
  :param session: the session object to get the color for
  :return: the styling for the given driver (color and line style)
  """
  return fastf1.plotting.get_driver_style(identifier=driver,
                                          style=['color', 'linestyle'],
                                          session=session)
