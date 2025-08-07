import fastf1
import fastf1.plotting
from pandas import NaT

from generated import analytics_pb2_grpc
from generated.analytics_pb2 import StrategyResponse, StrategyRequest, QuickLapsResponse, SpeedTracesResponse, \
  CarTelemetryResponse
from generated.types_pb2 import Strategy, Lap, Duration, SpeedTrace, CarTelemetry, PositionTelemetry


def map_row_to_lap(row, team_palette):
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


class AnalyticsServicer(analytics_pb2_grpc.AnalyticsServicer):

  def GetSessionStrategy(self, request: StrategyRequest, context):
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
