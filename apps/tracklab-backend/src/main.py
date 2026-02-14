import asyncio
import logging
import os
from concurrent import futures
import signal

import fastf1.plotting
import grpc

from tracklab.analytics.analytics import AnalyticsServicer
from tracklab.circuit_info.circuit_info import CircuitInfoServicer
from tracklab.event_schedule.event_schedule import EventScheduleServicer
from tracklab.session_results.session_results import SessionResultsServicer
from tracklab.copilot.live_data import LiveDataServicer
from tracklab.copilot.copilot import CopilotServicer
from __generated__.analytics_pb2_grpc import add_AnalyticsServicer_to_server
from __generated__.circuit_pb2_grpc import add_CircuitInfoServicer_to_server
from __generated__.event_schedule_pb2_grpc import add_EventScheduleServicer_to_server
from __generated__.results_pb2_grpc import add_SessionResultsServicer_to_server
from __generated__.copilot_pb2_grpc import add_LiveDataServicer_to_server
from __generated__.copilot_pb2_grpc import add_CopilotServicer_to_server


async def serve():
  server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))

  add_SessionResultsServicer_to_server(SessionResultsServicer(), server)
  add_EventScheduleServicer_to_server(EventScheduleServicer(), server)
  add_CircuitInfoServicer_to_server(CircuitInfoServicer(), server)
  add_AnalyticsServicer_to_server(AnalyticsServicer(), server)
  add_LiveDataServicer_to_server(LiveDataServicer(), server)
  add_CopilotServicer_to_server(CopilotServicer(), server)

  server.add_insecure_port("[::]:50051")

  await server.start()
  print("FastF1 Grpc server started!")

  stop_event = asyncio.Event()

  loop = asyncio.get_running_loop()
  for sig in (signal.SIGINT, signal.SIGTERM):
      loop.add_signal_handler(sig, stop_event.set)

  await stop_event.wait()

  print("Shutting down gRPC server...")
  await server.stop(grace=5)


if __name__ == "__main__":
  logging.basicConfig()
  logging.getLogger("fastf1").setLevel(logging.WARNING)
  fastf1.plotting.setup_mpl(mpl_timedelta_support=False, misc_mpl_mods=False,
                            color_scheme='fastf1')
  os.makedirs("./.cache", exist_ok=True)
  fastf1.Cache.enable_cache('./.cache')
  asyncio.run(serve())
