import asyncio
from concurrent import futures
import logging

import grpc

from event_schedule.event_schedule import EventScheduleServicer
from generated.event_schedule_pb2_grpc import add_EventScheduleServicer_to_server
from generated.results_pb2_grpc import add_SessionResultsServicer_to_server
from session_results.session_results import SessionResultsServicer


async def serve():
  server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
  add_SessionResultsServicer_to_server(
    SessionResultsServicer(), server
  )
  add_EventScheduleServicer_to_server(
    EventScheduleServicer(), server
  )
  server.add_insecure_port("[::]:50051")
  await server.start()
  print("FastF1 Grpc server started!")
  await server.wait_for_termination()


if __name__ == "__main__":
  logging.basicConfig()
  asyncio.run(serve())
