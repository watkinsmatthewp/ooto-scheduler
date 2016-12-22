function getActiveEvent(eventSearchTitle)
{
  log("Looking for active events with a title containing \"" + eventSearchTitle + "\"");
  
  var now = new Date();
  var matchingEvents = CalendarApp.getEventsForDay(now, {search: eventSearchTitle});
  
  if (matchingEvents != null && matchingEvents.length > 0)
  {
    for (var i = 0; i < matchingEvents.length; i++)
    {
      if (matchingEvents[i].getStartTime() < now && matchingEvents[i].getEndTime() > now)
      {
        log("Active event found");
        return matchingEvents[i]
      }
    }
  }
  
  log("No active event found");
  return null;
}