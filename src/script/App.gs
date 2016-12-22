function doGet()
{
  var app = UiApp.createApplication();
  try
  {
    var config = getConfig();
    config.firstRun = true;
    var message = null;
    if (isTrue(config))
    {
      message = getFirstRunMessage();
    }
    app = populateApp(app, config, message);
  }
  catch(err)
  {
    logError(err, config.logToFile);
  }
  return app;
}

function doPost(eventInfo)
{
  log("Post received");
  var app = UiApp.getActiveApplication();
  try
  {
    var config = getConfig();
    config.firstRun = false;
    
    log("Enabled: " + eventInfo.parameter.enabled, config.logToFile);
    config.enabled = isTrue(eventInfo.parameter.enabled);
    
    log("Event Title: " + eventInfo.parameter.eventTitle, config.logToFile);
    if (eventInfo.parameter.eventTitle != null && eventInfo.parameter.eventTitle != '')
    {
      config.eventTitle = eventInfo.parameter.eventTitle;
    }
    
    log("Email Filter: " + eventInfo.parameter.emailFilter, config.logToFile);
    if (eventInfo.parameter.emailFilter != null)
    {
      config.emailFilter = eventInfo.parameter.emailFilter;
    }
    
    log("Log to File: " + eventInfo.parameter.logToFile, config.logToFile)
    config.logToFile = isTrue(eventInfo.parameter.logToFile);
    
    saveConfig(config);
    app.add(app.createHTML(createMessageHTML("Settings saved successfully. Hit Refresh to return to the settings page")));
    
    log("Post processed. Updating the trigger", config.logToFile);
    
    // Set the trigger based on the config
    setTrigger(config.enabled);
    
    log("Trigger updated", config.logToFile);
  }
  catch (err)
  {
    app.add(app.createHTML(createMessageHTML("Error: " + err)));
    logError(err);
  }
  
  app.close();
  return app;
}

function populateApp(app, config, message)
{ 
  // Add header and message
  app.add(app.createHTML(createHeaderHTML("OOTO Scheduler Settings (v " + getCurrentVersion() + ")")));
  
  // Add current status info
  if (isTrue(config.enabled))
  {
    app.add(app.createHTML(createStatusHTML(getActiveEvent(config.eventTitle), true)));
  }
  else
  {
    app.add(app.createHTML(createStatusHTML(null, false)));
  }
  
  // Add any message
  app.add(app.createHTML(createMessageHTML(message)));
  
  // Create the panel and grid
  var form = app.createFormPanel().setStyleAttributes(css.body);
  var grid = app.createGrid(6, 2).setWidth("100%").setColumnStyleAttribute(0, 'width', '30%').setColumnStyleAttribute(1, 'width', '70%').setCellSpacing(10);
  
  // Scanning Enabled
  grid.setWidget(0, 0, app.createHTML("<div><h4 style=\"margin-bottom: 0; padding: 0\">Scanner Enabled</h4><p style=\"margin-bottom: 3em; padding: 0\">Check the box to enable inbox scanning and OOTO replies</p></div>"));
  grid.setWidget(0, 1, app.createCheckBox().setName("enabled").setId("enabled").setValue(isTrue(config.enabled)));
  
  // Event title
  grid.setWidget(1, 0, app.createHTML("<div><h4 style=\"margin-bottom: 0; padding: 0\">Calendar Event Title</h4><p style=\"margin-bottom: 3em; padding: 0\">Enter a search string to use to determine whether the scanner should reply to new messages (ex. OOTO)</p></div>"));
  grid.setWidget(1, 1, app.createTextBox().setName("eventTitle").setId("eventTitle").setText(config.eventTitle).setMaxLength(100).setStyleAttributes(css.textBox));
  
  // Email filter
  grid.setWidget(2, 0, app.createHTML("<div style=\"height: 300px; padding: 0\"><h4 style=\"margin-bottom: 0; padding: 0\">Email Filter (Optional)</h4><p>Enter any filter parameters you wish to apply, following Gmail's filter syntax.</p><p>Note that some filters are applied automatically, such as trashed messages, date ranges, notes to self, category filters, and common \"noreply\" emails</p><p  style=\"margin-bottom: 3em;\">More info at https://support.google.com/mail/answer/7190?hl=en</p></div>"));
  grid.setWidget(2, 1, app.createTextArea().setName("emailFilter").setId("emailFilter").setText(config.emailFilter).setStyleAttributes(css.textArea));
  
  // Log to file
  var logFileLinkText = '';
  if (isTrue(config.logToFile))
  {
    logFileLinkText = "Log File: " + getLogFile().getUrl();
  }
  grid.setWidget(3, 0, app.createHTML("<div><h4 style=\"margin-bottom: 0; padding: 0\">Log To File</h4><p  style=\"margin-bottom: 3em; padding: 0\">Advanced: check this box if you want to save the log file to your Google drive on each run<br /><br />" + logFileLinkText + "</p></div>"));
  grid.setWidget(3, 1, app.createCheckBox().setName("logToFile").setId("logToFile").setValue(isTrue(config.logToFile)));
  
  // Save button
  grid.setWidget(4, 1, app.createSubmitButton("Save").addClickHandler(app.createServerHandler("saveConfig")).setStyleAttributes(css.btnSubmit));
  
  // Force scan button
  grid.setWidget(5, 1, app.createButton("Scan now").addClickHandler(app.createServerHandler("forceScan")).setStyleAttributes(css.btnSubmit));
  
  // Add the grid to the panel
  form.add(grid);
  app.add(form);
  
  return app;
}

function createHeaderHTML(title)
{
  return "<h1 style=\"width: 75%; margin: auto; background-color: #2d6ca2; color: white; margin-bottom: 0; margin-top: 1em; padding: 40px 0 40px 10px;\">" + title + "</h1>";
}

function createStatusHTML(ootoEvent, scanningEnabled)
{
  var color = ootoEvent != null && isTrue(scanningEnabled) ? "green" : "gray";
  var message = '';
  if (isTrue(scanningEnabled)) {
    message = ootoEvent == null ? "No active OOTO event" : "Currently processing OOTO replies for the active event: \"" + ootoEvent.getTitle() + "\" (" + ootoEvent.getStartTime() + " through " + ootoEvent.getEndTime() + ")";
  }
  else
  {
    message = "Scanning is not enabled";
  }
  return "<p style=\"width: 75%; margin: auto; color: white; padding: 10px 0 10px 10px; background-color: " + color + ";\">" + Session.getEffectiveUser().getEmail() + " - " + message + "</p>";
}

function createMessageHTML(message)
{
  return message != null && message.length > 0 ?  "<p style=\"width: 75%; margin: auto; margin-bottom: 2em; padding: 10px 0 10px 10px; border: 2px solid #2d6ca2;\">" + message + "</p>" : "";
}

function getFirstRunMessage()
{
  return "OOTO Scheduler is a background process which uses Google Calendar events to schedule and send recurring \"Out of Office\" replies during times you specify. Once you complete setup, simply add an event to your calendar bearing the configured title. Any matching emails received during that event's lifetime will be replied to with the event description as the email body";
}