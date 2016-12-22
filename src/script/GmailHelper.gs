function getMatchingThreads(startDate, endDate, extraFilterText, logToFile)
{
  log("Getting threads with a start date of " + startDate + " and an end date of " + endDate);
  
  var filter = createFilter(startDate, endDate, extraFilterText);
  log("Filter text: \"" + filter + "\"", logToFile);
  
  var matchingThreads = GmailApp.search(filter);
  log(matchingThreads.length + " threads matched the filter", logToFile);
  
  matchingThreads = filterThreadsByDateAndTime(matchingThreads, startDate, endDate);
  log(matchingThreads.length + " threads met the time range criteria", logToFile);
  
  return matchingThreads;
}

function filterThreadsByDateAndTime(threads, startDate, endDate)
{
  if (threads.length == 0)
  {
    return threads;
  }
  else
  {
    var newThreadCollection = new Array();
    for (var i = 0; i < threads.length; i++)
    {
      var threadLastUpdate = threads[i].getLastMessageDate();
      if (threadLastUpdate > startDate && threadLastUpdate < endDate)
      {
        newThreadCollection.push(threads[i]);
      }
    }
    return newThreadCollection;
  }
}

function filterThreadsByID(threads, excludedThreadIDs)
{
  if (threads.length == 0 || excludedThreadIDs.length == 0)
  {
    return threads;
  }
  else
  {
    var newThreadCollection = new Array();
    for (var i = 0; i < threads.length; i++)
    {
      if (excludedThreadIDs.indexOf(getSafeID(threads[i])) < 0)
      {
        newThreadCollection.push(threads[i]);
      }
    }
    return newThreadCollection;
  }
}

function replyAll(config, thread, emailBody)
{
  if (isTrue(config.debug))
  {
    log("Test Mode. Not sending email", config.logToFile);
  }
  else
  {
    log("Sending email", logToFile);
    thread.replyAll(emailBody);
  }
}

function replyAll(config, thread, emailBody, emailSubject)
{
  if (isTrue(config.debug))
  {
    log("Test Mode. Not sending email", config.logToFile);
  }
  else
  {
    log("Sending email", config.logToFile);
    thread.replyAll(emailBody, {subject: emailSubject});
  }
}

function getSafeID(thread)
{
  return thread.getMessages()[0].getId();
}