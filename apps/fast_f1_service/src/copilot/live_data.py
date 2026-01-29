from asyncio import sleep
from datetime import datetime
from generated import copilot_pb2_grpc
from generated.copilot_pb2 import DataPoint

class LiveDataServicer(copilot_pb2_grpc.LiveDataServicer):
    def __init__(self):
        self.speed = 1;

    async def StreamData(self, _, context):
        base_interval = 1.0  # seconds

        while True:
            yield DataPoint(value=1, timestamp=int(datetime.now().timestamp()))
            await sleep(base_interval / self.speed)

    def SetStreamSpeed(self, request):
        self.speed = request.speed
