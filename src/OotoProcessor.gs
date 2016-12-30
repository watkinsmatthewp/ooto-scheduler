function processOotoMessages() {
  Logger.log('Processing');
  var settings = getOrCreateSettings();
  if (settings.appEnabled) {
    var activeOttoEvent = getActiveOotoEvent(settings.calendarEventTitle);
    var responseSubject = activeOttoEvent.getLocation();
    var responseBody = activeOttoEvent.getDescription();
    
    if (activeOttoEvent) {
      Logger.log('There is an active OTOO event with title ' + activeOttoEvent.getTitle());
      var threadsToRespondTo = getMatchingThreads(activeOttoEvent.getStartTime(), activeOttoEvent.getEndTime(), settings.emailFilter);
      if (threadsToRespondTo.length > 0) {
        Logger.log('There are ' + threadsToRespondTo.length + ' qualifying threads');
        var processedThreadIDs = getProcessedThreadIDs();
        Logger.log('There are ' + processedThreadIDs.length + ' processed threads');
        for (var i = 0; i < threadsToRespondTo.length; i++) {
          var threadID = threadsToRespondTo[i].getId();
          if (processedThreadIDs.indexOf(threadID) >= 0) {
            Logger.log('Skipping already processed thread ' + threadID);
          } else { 
            Logger.log('Processing thread ' + threadID);
            replyToThread(threadsToRespondTo[i], responseSubject, responseBody);
            processedThreadIDs.push(threadID);
            setProcessedThreadIDs(processedThreadIDs);
          }
        }
      }
    } else {
      setProcessedThreadIDs([]);
    }
  } else {
    setProcessedThreadIDs([]);
  }
  Logger.log('Done processing');
}

function getActiveOotoEvent(eventSearchTitle)
{
  var now = new Date();
  var matchingEvents = CalendarApp.getEventsForDay(now, { search: eventSearchTitle });
  if (matchingEvents && matchingEvents.length > 0) {
    for (var i = 0; i < matchingEvents.length; i++)
    {
      if (matchingEvents[i].getStartTime() < now && matchingEvents[i].getEndTime() > now)
      {
        return matchingEvents[i];
      }
    }
  }
  return null;
}

function getMatchingThreads(startDate, endDate, extraFilterText, logToFile) {
  var filter = createFilter(startDate, endDate, extraFilterText);
  Logger.log('Getting emails with the filter ' + filter);
  return filterThreadsByDateAndTime(GmailApp.search(filter), startDate, endDate);
}

function createFilter(startDate, endDate, extraFilterText) {
  var filter = (getDefaultFilter() + " after:" + getDateString(startDate));
  filter += (" before:" + getDateString(addDays(endDate, 1)));
  if (extraFilterText != null && extraFilterText.length > 0)
  {
    filter += (" " + replaceLineBreaks(extraFilterText, " "));
  }
  return filter;
}

function getDateString(date) {
  return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}

function getDefaultFilter() {
  return 'is:unread to:me -from:me'
  + ' -in:trash -in:spam -is:chat'
  + ' -from:noreply -from:no-reply -from:donotreply -from:news -from:newsletter -from:newsletters -from:forum -from:forums -from:campaign -from:campaigns'
  + ' -category:promotions -category:forums -category:social';
}

function filterThreadsByDateAndTime(threads, startDate, endDate) {
  var filteredThreads = [];
  while (threads.length > 0) {
    var thread = threads.pop();
    var threadLastUpdate = thread.getLastMessageDate();
    if (threadLastUpdate > startDate && threadLastUpdate < endDate) {
      filteredThreads.push(thread);
    }
  }
  return filteredThreads;
}

function replyToThread(thread, responseSubject, responseBody) {
  var effectiveSubject = responseSubject || thread.getFirstMessageSubject();
  var effectiveBody = responseBody || 'Hello. I am currently out of the office. I will try to reply to this message when I get back. Thank you';
  thread.replyAll(effectiveBody, { subject: effectiveSubject });
}