import asyncio
import logging
import os
from concurrent import futures

import fastf1.plotting
import grpc

from analytics.analytics import AnalyticsServicer
from circuit_info.circuit_info import CircuitInfoServicer
from event_schedule.event_schedule import EventScheduleServicer
from generated.analytics_pb2_grpc import add_AnalyticsServicer_to_server
from generated.circuit_pb2_grpc import add_CircuitInfoServicer_to_server
from generated.event_schedule_pb2_grpc import add_EventScheduleServicer_to_server
from generated.results_pb2_grpc import add_SessionResultsServicer_to_server
from session_results.session_results import SessionResultsServicer


async def serve():
  server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
  add_SessionResultsServicer_to_server(SessionResultsServicer(), server)
  add_EventScheduleServicer_to_server(EventScheduleServicer(), server)
  add_CircuitInfoServicer_to_server(CircuitInfoServicer(), server)
  add_AnalyticsServicer_to_server(AnalyticsServicer(), server)
  server.add_insecure_port("[::]:50051")

  await server.start()
  print("FastF1 Grpc server started!")

  await server.wait_for_termination()


if __name__ == "__main__":
  logging.basicConfig()
  logging.getLogger("fastf1").setLevel(logging.WARNING)
  fastf1.plotting.setup_mpl(mpl_timedelta_support=False, misc_mpl_mods=False,
                            color_scheme='fastf1')
  os.makedirs("./.cache", exist_ok=True)
  fastf1.Cache.enable_cache('./.cache')
  asyncio.run(serve())
