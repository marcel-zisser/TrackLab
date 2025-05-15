from concurrent import futures
import logging

import grpc

from generated.results_pb2_grpc import add_SessionResultsServicer_to_server
from generated.route_guide_pb2_grpc import add_RouteGuideServicer_to_server
from route_guide.route_guide import RouteGuideServicer
from session_results.session_results import SessionResultsServicer


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  add_RouteGuideServicer_to_server(
    RouteGuideServicer(), server
  )
  add_SessionResultsServicer_to_server(
    SessionResultsServicer(), server
  )
  server.add_insecure_port("[::]:50051")
  server.start()
  print("FastF1 Grpc server started!")
  server.wait_for_termination()


if __name__ == "__main__":
  logging.basicConfig()
  serve()
