from datetime import datetime

import fastf1

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
      name=event_date.Session1,
      date=datetime.isoformat(event_date.Session1Date)
    ),
    SessionInfo(
      name=event_date.Session2,
      date=datetime.isoformat(event_date.Session2Date)
    ),
    SessionInfo(
      name=event_date.Session3,
      date=datetime.isoformat(event_date.Session3Date)
    ),
    SessionInfo(
      name=event_date.Session4,
      date=datetime.isoformat(event_date.Session4Date)
    ),
    SessionInfo(
      name=event_date.Session5,
      date=datetime.isoformat(event_date.Session5Date)
    ),
  ]


def map_event(event_data) -> Event:
  """
  Maps the event data to an Event object
  :param event_data: the raw data
  :return: the mapped Event object
  """
  return Event(
    roundNumber=event_data.RoundNumber,
    country=event_data.Country,
    location=event_data.Location,
    officialName=event_data.OfficialEventName,
    name=event_data.EventName,
    date=datetime.isoformat(event_data.EventDate),
    format=event_data.EventFormat,
    f1ApiSupport=event_data.F1ApiSupport,
    sessionInfos=map_session_infos(event_data)
  )


class EventScheduleServicer(event_schedule_pb2_grpc.EventScheduleServicer):

  def GetEventSchedule(self, request, context) -> EventScheduleResponse:
    response = EventScheduleResponse()
    event_schedule = fastf1.get_event_schedule(request.season)

    for event in event_schedule.itertuples():
      if event.EventFormat != 'testing':
        response.events.append(map_event(event))

    return response
