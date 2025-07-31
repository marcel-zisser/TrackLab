import fastf1
from fastf1.ergast import Ergast

from generated import circuit_pb2_grpc
from generated.types_pb2 import Circuit, Location, CircuitInformation, TrackLocation


def map_to_track_location(data):
  return [
    TrackLocation(
      x=location.X,
      y=location.Y,
      number=location.Number,
      letter=location.Letter,
      angle=location.Angle,
      distance=location.Distance
    ) for location in data.itertuples()
  ]


class CircuitInfoServicer(circuit_pb2_grpc.CircuitInfoServicer):

  def __init__(self):
    self.ergast = Ergast()

  def GetCircuit(self, request, context):
    circuit_data = self.ergast.get_circuits(season=request.year, round=request.round)

    return Circuit(
      id=circuit_data.circuitId[0],
      name=circuit_data.circuitName[0],
      url=circuit_data.circuitUrl[0],
      location=Location(
        country=circuit_data.country[0],
        locality=circuit_data.locality[0],
        latitude=circuit_data.lat[0],
        longitude=circuit_data.long[0],
      )
    )

  def GetCircuitInformation(self, request, context):
    session = fastf1.get_session(request.year, request.round, request.session)
    session.load()
    circuit_info = session.get_circuit_info()

    return CircuitInformation(
      corners=map_to_track_location(circuit_info.corners),
      marshall_lights=map_to_track_location(circuit_info.corners),
      marshall_sectors=map_to_track_location(circuit_info.corners),
      rotation=circuit_info.rotation
    )
