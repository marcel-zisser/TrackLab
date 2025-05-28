from datetime import datetime

import fastf1
import logging

from generated import event_schedule_pb2_grpc
from generated.event_schedule_pb2 import EventScheduleResponse
from generated.types_pb2 import Event

def map_event(event_data):
  """
  Maps the event data to an Event object
  :param event_data: the raw data
  :return: the mapped Event object
  """
  return Event(
    roundNumber = event_data.get('RoundNumber'),
    country = event_data.get('Country'),
    location = event_data.get('Location'),
    officialEventName = event_data.get('OfficialEventName'),
    eventName = event_data.get('EventName'),
    eventDate = datetime.isoformat(event_data.get('EventDate')),
    eventFormat = event_data.get('EventFormat'),
    f1ApiSupport = event_data.get('F1ApiSupport')
  )


class EventScheduleServicer(event_schedule_pb2_grpc.EventScheduleServicer):
  def __init__(self):
    logging.getLogger("fastf1").setLevel(logging.WARNING)


  def GetEventSchedule(self, request, context):
    response = EventScheduleResponse()
    event_schedule = fastf1.get_event_schedule(request.season)

    for index in range(len(event_schedule) - 1):
      response.events.append(map_event(event_schedule.get_event_by_round(index + 1)))

    return response
