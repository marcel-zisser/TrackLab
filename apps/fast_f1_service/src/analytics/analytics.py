import datetime

import fastf1
import fastf1.plotting
import numpy as np

from analytics.analytics_helpers import map_row_to_lap, get_drivers_standings, \
  calculate_max_points_for_remaining_season, calculate_who_can_win, get_driver_plot_style
from generated import analytics_pb2_grpc
from generated.analytics_pb2 import StrategyResponse, SpeedTracesResponse, \
  CarTelemetryResponse, DriversResponse, PositionDataResponse, DriverPositionData, SessionRequest, \
  ChampionshipContendersResponse, TrackDominationResponse, LapsResponse
from generated.types_pb2 import Strategy, SpeedTrace, CarTelemetry, PositionTelemetry, Driver


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

  def GetLaps(self, request, context):
    response = LapsResponse()

    session = fastf1.get_session(request.year, request.round, 'Race')
    session.load()
    laps = session.laps.pick_drivers([request.drivers[0]])
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

    for lap in transformed_laps.itertuples():
      response.laps.append(map_row_to_lap(lap, team_palette))

    return response

  def GetQuickLaps(self, request, context):
    response = LapsResponse()

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

  def GetTrackDomination(self, request, context):
    response = TrackDominationResponse()

    session = fastf1.get_session(request.year, request.round, request.session)
    session.load()
    driver_1 = session.get_driver(request.drivers[0])
    driver_2 = session.get_driver(request.drivers[1])

    laps_driver_1 = session.laps.pick_drivers(driver_1.Abbreviation)
    laps_driver_2 = session.laps.pick_drivers(driver_2.Abbreviation)

    telemetry_driver_1 = laps_driver_1.pick_fastest().get_telemetry().add_distance()
    telemetry_driver_2 = laps_driver_2.pick_fastest().get_telemetry().add_distance()

    dist = np.arange(0, min(telemetry_driver_1['Distance'].max(), telemetry_driver_2['Distance'].max()), 1)

    speed1 = np.interp(dist, telemetry_driver_1['Distance'], telemetry_driver_1['Speed'])
    speed2 = np.interp(dist, telemetry_driver_2['Distance'], telemetry_driver_2['Speed'])

    x = np.interp(dist, telemetry_driver_1['Distance'], telemetry_driver_1['X'])
    y = np.interp(dist, telemetry_driver_1['Distance'], telemetry_driver_1['Y'])

    dt1 = 1 / speed1 * np.gradient(dist)  # time for each segment
    dt2 = 1 / speed2 * np.gradient(dist)

    t1 = np.cumsum(dt1)
    t2 = np.cumsum(dt2)

    delta = t1 - t2

    dominance = np.where(delta < 0, driver_1.Abbreviation, driver_2.Abbreviation)

    for index in range(len(dominance)):
      response.coordinates.append(PositionTelemetry(x=x[index], y=y[index]))
      response.domination.append(dominance[index])

    line_style_1 = get_driver_plot_style(driver_1.Abbreviation, session)
    line_style_2 = get_driver_plot_style(driver_2.Abbreviation, session)

    response.drivers.append(Driver(
      code=driver_1.Abbreviation,
      givenName=driver_1.FirstName,
      familyName=driver_1.LastName,
      color=line_style_1['color'],
      lineStyle=line_style_1['linestyle']
    ))

    response.drivers.append(Driver(
      code=driver_2.Abbreviation,
      givenName=driver_2.FirstName,
      familyName=driver_2.LastName,
      color=line_style_2['color'],
      lineStyle=line_style_2['linestyle']
    ))

    return response
