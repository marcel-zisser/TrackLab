from fastf1.ergast import Ergast

from generated import circuit_pb2_grpc
from generated.types_pb2 import Circuit, Location


class CircuitInfoServicer(circuit_pb2_grpc.CircuitInfoServicer):

  def __init__(self):
    self.ergast = Ergast()

  def GetCircuitBaseInformation(self, request, context):
    circuit_data = self.ergast.get_circuits(season=request.season, round=request.round)

    return Circuit(
      id = circuit_data.circuitId[0],
      name = circuit_data.circuitName[0],
      url = circuit_data.circuitUrl[0],
      location = Location (
        country = circuit_data.country[0],
        locality = circuit_data.locality[0],
        latitude = circuit_data.lat[0],
        longitude = circuit_data.long[0],
      )
    )
