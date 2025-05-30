from datetime import datetime

import fastf1
import logging

from generated import event_schedule_pb2_grpc
from generated.event_schedule_pb2 import EventScheduleResponse
from generated.types_pb2 import Event, SessionInfo


def map_session_infos(event_date) -> list[SessionInfo]:
  """
  Maps the sessions infos of the event into an array
  :param event_date: the raw data
  :return: array of session infos
  """
  return [
    SessionInfo(
      name = event_date.get('Session1'),
      date = datetime.isoformat(event_date.get('Session1Date'))
    ),
    SessionInfo(
      name = event_date.get('Session2'),
      date = datetime.isoformat(event_date.get('Session2Date'))
    ),
    SessionInfo(
      name = event_date.get('Session3'),
      date = datetime.isoformat(event_date.get('Session3Date'))
    ),
    SessionInfo(
      name = event_date.get('Session4'),
      date = datetime.isoformat(event_date.get('Session4Date'))
    ),
    SessionInfo(
      name = event_date.get('Session5'),
      date = datetime.isoformat(event_date.get('Session5Date'))
    ),
  ]


def map_event(event_data) -> Event:
  """
  Maps the event data to an Event object
  :param event_data: the raw data
  :return: the mapped Event object
  """
  return Event(
    roundNumber = event_data.get('RoundNumber'),
    country = event_data.get('Country'),
    location = event_data.get('Location'),
    officialName = event_data.get('OfficialEventName'),
    name = event_data.get('EventName'),
    date = datetime.isoformat(event_data.get('EventDate')),
    format = event_data.get('EventFormat'),
    f1ApiSupport = event_data.get('F1ApiSupport'),
    sessionInfos = map_session_infos(event_data)
  )


class EventScheduleServicer(event_schedule_pb2_grpc.EventScheduleServicer):

  def GetEventSchedule(self, request, context) -> EventScheduleResponse:
    response = EventScheduleResponse()
    event_schedule = fastf1.get_event_schedule(request.season)

    for index in range(len(event_schedule) - 1):
      response.events.append(map_event(event_schedule.get_event_by_round(index + 1)))

    return response
