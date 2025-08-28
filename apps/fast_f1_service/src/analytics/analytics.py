import datetime

import fastf1
import fastf1.plotting
import numpy as np

from analytics.analytics_helpers import map_row_to_lap, get_drivers_standings, \
  calculate_max_points_for_remaining_season, calculate_who_can_win
from generated import analytics_pb2_grpc
from generated.analytics_pb2 import StrategyResponse, QuickLapsResponse, SpeedTracesResponse, \
  CarTelemetryResponse, DriversResponse, PositionDataResponse, DriverPositionData, SessionRequest, \
  ChampionshipContendersResponse
from generated.types_pb2 import Strategy, SpeedTrace, CarTelemetry, PositionTelemetry


class AnalyticsServicer(analytics_pb2_grpc.AnalyticsServicer):

  def GetSessionStrategy(self, request: SessionRequest, context):
    response = StrategyResponse()

    session = fastf1.get_session(request.year, request.round, request.session)
    session.load()

    laps = session.laps

    stints = laps[["Driver", "Stint", "Compound", "LapNumber"]]
    stints = stints.groupby(["Driver", "Stint", "Compound"])
    stints = stints.count().reset_index()

    stints = stints.rename(columns={"LapNumber": "StintLength"})

    for index, row in stints.iterrows():
      response.strategy.append(
        Strategy(
          driver=row['Driver'],
          stint=int(row['Stint']),
          stintLength=row['StintLength'],
          compound=row['Compound']
        )
      )

    return response

  def GetQuickLaps(self, request, context):
    response = QuickLapsResponse()

    session = fastf1.get_session(request.year, request.round, 'Race')
    session.load()
    laps = session.laps.pick_quicklaps()

    transformed_laps = laps.copy()
    transformed_laps.loc[:, "LapTime (s)"] = laps["LapTime"].dt.total_seconds()

    # order the team from the fastest (lowest median lap time) tp slower
    team_order = (
      transformed_laps[["Team", "LapTime (s)"]]
      .groupby("Team")
      .median()["LapTime (s)"]
      .sort_values()
      .index
    )

    team_palette = {team: fastf1.plotting.get_team_color(team, session=session)
                    for team in team_order}

    for row in transformed_laps.itertuples():
      response.laps.append(map_row_to_lap(row, team_palette))
    return response

  def GetSpeedTraces(self, request, context):
    response = SpeedTracesResponse()

    session = fastf1.get_session(request.year, request.round, request.session)
    session.load()

    for driver in session.drivers:
      fastest_lap = session.laps.pick_drivers(driver).pick_fastest()
      if fastest_lap is not None:
        car_data = fastest_lap.get_car_data().add_distance()
        response.speed_traces.extend(
          [SpeedTrace(driver=fastest_lap.Driver, distance=trace.Distance, speed=trace.Speed) for trace in
           car_data.itertuples()])

    return response

  def GetCarTelemetry(self, request, context):
    response = CarTelemetryResponse()

    session = fastf1.get_session(request.year, request.round, request.session)
    session.load()

    for driver in session.drivers:
      fastest_lap = session.laps.pick_drivers(driver).pick_fastest()
      if fastest_lap is not None:
        car_data = fastest_lap.get_car_data().add_distance()
        car_data = fastest_lap.get_pos_data().merge_channels(car_data)
        response.telemetries.extend(
          [CarTelemetry(
            driver=fastest_lap.Driver,
            speed=data.Speed,
            rpm=data.RPM,
            nGear=data.nGear,
            throttle=data.Throttle,
            brake=data.Brake,
            drs=data.DRS,
            distance=data.Distance,
            position=PositionTelemetry(
              x=data.X,
              y=data.Y,
              z=data.Z,
              status=data.Status
            ) if request.withPosition else None
          ) for data in
            car_data.itertuples()
          ])

    return response

  def GetDrivers(self, request, context):
    response = DriversResponse()

    session = fastf1.get_session(request.year, request.round, request.session)
    session.load(laps=False, telemetry=False, weather=False, messages=False)

    for driverNumber in session.drivers:
      driver = session.get_driver(driverNumber)
      response.drivers.append(driver.Abbreviation)

    return response

  def GetPositionData(self, request, context):
    response = PositionDataResponse()

    session = fastf1.get_session(request.year, request.round, 'Race')
    session.load()

    for driverNumber in session.drivers:
      driver = session.get_driver(driverNumber)
      laps = session.laps.pick_drivers(driverNumber)
      positions = [int(lap.Position) for lap in laps.itertuples() if not np.isnan(lap.Position)]
      positions.insert(0, int(driver.GridPosition))
      style = fastf1.plotting.get_driver_style(identifier=driver.Abbreviation,
                                               style=['color', 'linestyle'],
                                               session=session)
      response.payload[driver.Abbreviation].CopyFrom(DriverPositionData(positions=positions, color=style['color'],
                                                                        lineStyle=style['linestyle']))

    return response

  def GetChampionshipContenders(self, request, context):
    response = ChampionshipContendersResponse()

    events = fastf1.events.get_event_schedule(request.year, include_testing=False)

    for event in events.itertuples():
      if event.EventDate < datetime.datetime.now():
        driver_standings = get_drivers_standings(request.year, event.RoundNumber)
        points = calculate_max_points_for_remaining_season(request.year, event.RoundNumber)
        can_win = calculate_who_can_win(driver_standings, points)
        response.payload[event.Location].contenders.extend(can_win)
        response.payload[event.Location].roundNumber = event.RoundNumber

    return response
