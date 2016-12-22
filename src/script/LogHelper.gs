function beginLog(logToFile)
{
  log("-------------------------------", logToFile);
}

function logError(err)
{
  logError(err, false);
}

function logError(err, logToFile)
{
  log(err.message + "\n" + err.stack, logToFile); 
}

function log(message)
{
  log(message, false);
}

function log(message, logToFile)
{
  Logger.log(message);
  if (isTrue(logToFile))
  {
    appendLineToLogFile(new Date() + " - " + message);
  }  
}

function appendLineToLogFile(message)
{
  var logFile = getLogFile();
  logFile.append("\n" + message);
}

function getLogFile()
{
  var logFile;
  var matchingLogFiles = DocsList.find('OOTO_Scheduler_Log.log');
  if (matchingLogFiles.length > 0)
  {
    logFile = matchingLogFiles[0];
    if (logFile.getSize() > 5242880)
    {
      // greater than 5 MB. Wipe
      logFile.clear();
    }
  }
  else
  {
    // Auto-create
    logFile = DocsList.createFile('OOTO_Scheduler_Log.log', '', MimeType.PLAIN_TEXT);
  }

  return logFile;
}