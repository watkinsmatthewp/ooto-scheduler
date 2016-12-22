function getCurrentVersion()
{
  return 3.5;
}

/* EVENT HANDLERS */
function forceScan()
{
  var config = getConfig();
  beginLog(config.logToFile);
  log("Scan forced", config.logToFile);
  doWork(config);
}

function run()
{
  var config = getConfig();
  beginLog(config.logToFile);
  log("Timer has ticked", config.logToFile);
  doWork(config);
}

/* MAIN WORKER METHOD */
function doWork(config)
{
  log("Starting run. Version: " + getCurrentVersion(), config.logToFile);
  try
  {
    if (!isTrue(config.enabled))
    {
      log("Scanner is disabled", config.logToFile);
    }
    else
    {
      log("Scanner is enabled", config.logToFile);
      var activeEvent = getActiveEvent(config.eventTitle);
      if (activeEvent != null)
      {
        log("There is currently an active event: " + activeEvent.getTitle(), config.logToFile);
        var matchingThreads = getMatchingThreads(activeEvent.getStartTime(), activeEvent.getEndTime(), config.emailFilter, config.logToFile);
        if (matchingThreads.length > 0)
        {
          var allPocessedThreadIDs = getAllProcessedMessageIDs();
          log(allPocessedThreadIDs.length + " threads have previously been processed in relation to this event", config.logToFile);
          
          matchingThreads = filterThreadsByID(matchingThreads, allPocessedThreadIDs);
          log(matchingThreads.length + " current email threads have not yet been processed", config.logToFile);
          if (matchingThreads.length > 0)
          {
            sendRepliesAndMarkAsProcessed(matchingThreads, activeEvent.getLocation(), activeEvent.getDescription(), config);
          }
        }
        log("Finished processing the " + matchingThreads.length + " qualifying email threads", config.logToFile);
      }
      else
      {
        // We're not in an active event any more. Any thread IDs in the DB have already served their purpose, so remove them
        log("There is currently no active event. Clearing the DB", config.logToFile);
        clearAllProcessedMessageIDs();
      }
    }
  }
  catch (err)
  {
    logError(err, config.logToFile);
  }
  log("Done", config.logToFile);
}


/* HELPER FUNCTIONS */
function sendRepliesAndMarkAsProcessed(threads, emailSubject, emailBody, config)
{
  var overwriteSubjectLine = (emailSubject != null && emailSubject.trim().length > 0);
  if (isTrue(overwriteSubjectLine))
  {
    emailSubject = emailSubject.trim();
  }
  
  if (emailBody == null || emailBody == '')
  {
    emailBody = 'Hello. I am currently out of the office. I will reply to your message when I get back. Thank you';
  }
  
  for (var i = 0; i < threads.length; i++)
  {
    log("Responding to message with subject " + threads[i].getFirstMessageSubject(), config.logToFile);
    if (isTrue(overwriteSubjectLine))
    {
      replyAll(config, threads[i], emailBody, emailSubject);
    }
    else
    {
      replyAll(config, threads[i], emailBody);
    }
    
    saveProcessedMessageID(getSafeID(threads[i]), config.logToFile);
  }
}

function setTrigger(enabled)
{
  var triggers = ScriptApp.getProjectTriggers();  
  if (isTrue(enabled))
  {
    var triggerFound = false;
    for (var i = 0; i < triggers.length; i++)
    {
      if (triggers[i].getHandlerFunction().toLowerCase() == "run")
      {
        triggerFound = true;
        break;
      }
    }
    
    if (!isTrue(triggerFound))
    {
      // The trigger doesn't already exist. Create it
      var trigger = ScriptApp.newTrigger("run").timeBased().everyMinutes(15).create();
    }
  }
  else
  {
    // delete all triggers for this app
    if (triggers.length > 0)
    {
      for(var i in triggers) 
      {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
  }
}