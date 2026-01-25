from datetime import time
from generated.copilot_pb2_grpc import LiveDataServiceServicer
from generated.copilot_pb2 import DataPoint

class LiveDataServicer(LiveDataServiceServicer):
    def __init__(self):
        self.speed = 1;

    def StreamData(self, _, context):
        base_interval = 1.0  # seconds

        while context.is_active():
            yield DataPoint(value=1, timestamp=int(time.time()))
            time.sleep(base_interval / self.speed_factor)

    def SetStreamSpeed(self, request):
        self.speed = request.speed
