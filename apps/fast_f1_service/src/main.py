from concurrent import futures
import logging

import grpc

from apps.fast_f1_service.src.generated.route_guide_pb2_grpc import add_RouteGuideServicer_to_server, RouteGuideServicer


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  add_RouteGuideServicer_to_server(
    RouteGuideServicer(), server
  )
  server.add_insecure_port("[::]:50051")
  server.start()
  print("FastF1 Grpc server started!")
  server.wait_for_termination()


if __name__ == "__main__":
  logging.basicConfig()
  serve()
