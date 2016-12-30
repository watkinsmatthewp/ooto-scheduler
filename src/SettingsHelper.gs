function setNextRatingPromptDate(daysInTheFuture) {
  var settings = getOrCreateSettings();
  if (daysInTheFuture < 0) {
    // Set to an impossibly future date
    settings.nextRatingPromptDate = new Date(3000, 01, 01);
  }
  else {
    var date = new Date();
    date = addDays(date, daysInTheFuture);
    settings.nextRatingPromptDate = date;
  }
  setSettings(getSettings(), settings);
}

function validateAndSetSettings(settings) {
  if (settings == null) {
    throw 'Cannot have a null settings object';
  }

  Logger.log(settings);

  // Required field checks
  if (isNullOrWhiteSpace(settings.calendarEventTitle)) {
    throw 'Please specify a calendar event title';
  }

  setSettings(getSettings(), settings);
  return settings;
}

function getOrCreateSettings() {
  var settings = getSettings();
  if (!settings) {
    settings = createDefaultSettings();
    setSettings(null, settings);
  }
  return settings;
}

function getSettings() {
  var settingsString = PropertiesService.getUserProperties().getProperty('OttoScheduler.Settings');
  if (settingsString == null || settingsString == '') {
    return null;
  } else {
    Logger.log('Retrieved settings: ' + settingsString);
    return JSON.parse(settingsString);
  }
}

function setSettings(oldSettings, newSettings) {
  var oldSettingsString = oldSettings == null ? '' : JSON.stringify(oldSettings);
  var newSettingsString = JSON.stringify(newSettings);
  
  // Only do work if the settings have changed
  if (oldSettingsString !== newSettingsString) {
    PropertiesService.getUserProperties().setProperty('OttoScheduler.Settings', newSettingsString);

    // Delete existing triggers
    var trigger = null;
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() == 'processOotoMessages') {
        trigger = triggers[i];
        break;
      }
    }
    
    if (newSettings.appEnabled) {
      if (!trigger) {
        Logger.log('Creating a new trigger');
        ScriptApp.newTrigger('processOotoMessages').timeBased().everyMinutes(15).create();
      }
    } else {
      if (trigger) {
        ScriptApp.deleteTrigger(trigger);
      }
    }
  }
}

function createDefaultSettings() {
  return {
    appEnabled : false,
    calendarEventTitle: '',
    emailFilter: '',
  };
}

function getProcessedThreadIDs() {
  var messageIDsString = PropertiesService.getUserProperties().getProperty('OttoScheduler.ProcessedThreadIDs');
  return (messageIDsString || '').split(',');
}

function setProcessedThreadIDs(messageIDs) {
  PropertiesService.getUserProperties().setProperty('OttoScheduler.ProcessedThreadIDs', (messageIDs || []).join(','));
}

function isNullOrWhiteSpace(input) {
  if (typeof input === 'undefined' || input == null) {
    return true;
  }
  return input.replace(/\s/g, '').length < 1;
}

function addDays(dateObject, numDays) {
  dateObject.setDate(dateObject.getDate() + numDays);
  return dateObject;
}