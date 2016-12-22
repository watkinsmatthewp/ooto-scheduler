/* CONFIG FUNCTIONS */

function getConfig()
{
  var thisConfig = createDefaultConfig();
  var allKeys = UserProperties.getKeys();
  var configSettingFound = false;
  if (allKeys != null && allKeys.length > 0)
  {
    for (var i = 0; i < allKeys.length; i++)
    {
      switch (allKeys[i])
      {
        case "config_enabled":
          thisConfig.enabled = UserProperties.getProperty("config_enabled");
          configSettingFound = true;
          break;
        case "config_eventTitle":
          thisConfig.eventTitle = UserProperties.getProperty("config_eventTitle");
          configSettingFound = true;
          break;
        case "config_emailFilter":
          thisConfig.emailFilter = UserProperties.getProperty("config_emailFilter");
          configSettingFound = true;
          break;
        case "config_debug":
          thisConfig.debug = UserProperties.getProperty("config_debug");
          configSettingFound = true;
          break;
        case "config_firstRun":
          thisConfig.firstRun = UserProperties.getProperty("config_firstRun");
          configSettingFound = true;
          break;
        case "config_logToFile":
          thisConfig.logToFile = UserProperties.getProperty("config_logToFile");
          configSettingFound = true;
          break;
      }
    }
  }
  
  if (configSettingFound == "false")
  {
    // First run. Also save to properties
    saveConfig(thisConfig);
  }
  
  return thisConfig;
}

function saveConfig(thisConfig)
{
  log("Saving config", thisConfig.logToFile);
  try
  {
    UserProperties.setProperties({
      config_enabled: thisConfig.enabled,   
      config_eventTitle: thisConfig.eventTitle,
      config_emailFilter: thisConfig.emailFilter,
      config_debug: thisConfig.debug,
      config_firstRun: thisConfig.firstRun,
      config_logToFile: thisConfig.logToFile
    });
  }
  catch (err)
  {
    log('Uh-oh');
    logError(err);
  }
  log("Config saved", thisConfig.logToFile);
}

function createDefaultConfig()
{
  var thisConfig = new Object();
  thisConfig.enabled = false;
  thisConfig.debug = false;
  thisConfig.eventTitle = "OOTO";
  thisConfig.emailFilter = "";
  thisConfig.logToFile = false;
  return thisConfig;
}





/* MESSAGE ID FUNCTIONS */

function getAllProcessedMessageIDs()
{
  return getMessageListRecord(ScriptDb.getMyDb()).value;  
}

function saveProcessedMessageID(messageID, logToFile)
{
  log("Adding message ID " + messageID + " to archived message list", logToFile);
  var db = ScriptDb.getMyDb();
  var record = getMessageListRecord(db);
  record.value.push(messageID);
  db.save(record);
  log("Added", logToFile);
}

function clearAllProcessedMessageIDs()
{
  var db = ScriptDb.getMyDb();
  var record = getMessageListRecord(db);
  if (record.value == null || record.value.length > 0)
  {
    record.value = new Array();
    db.save(record);
  }
}



/* HELPER FUNCTIONS */

function getMessageListRecord(db)
{
  var messageListRecord;
  var messageListRecordID = UserProperties.getProperty('messageListRecordID');
  
  if (messageListRecordID == null)
  {
    // First run. Create the rercord and save the record ID
    messageListRecord = createNewMessageIDRecord(db);
  }
  else
  {
    messageListRecord = db.load(messageListRecordID);
    if (messageListRecord == null)
    {
      // TODO: We have an ID but no data in the DB? Create it for now, I guess
      messageListRecord = createNewMessageIDRecord(db);
    }
    else if (messageListRecord.value == null)
    {
      messageListRecord.value = new Array();
    }
  }
  
  return messageListRecord;
}

function createNewMessageIDRecord(db)
{
  var record = db.save({ type: 'messageIDList', value: new Array() });
  UserProperties.setProperty('messageListRecordID', record.getId());
  return record;
}