<!-- Use a templated HTML printing scriptlet to import common stylesheet. -->
<?!= HtmlService.createHtmlOutputFromFile('Stylesheet').getContent(); ?>

<html>
<head>
  <title>OTOO Scheduler</title>
</head>

<body>
  <!-- Ratings modal -->
  <div id="modalContainer">
    <div id="modalShade"></div>
    <div id="modal">
    <h2 id="modalHeader" style="font-weight: bold;">Do you <span style="color: red;">♥</span> OTOO Scheduler?</h2>
    <hr style="margin-bottom: 2em;"/>
    <h4 id="modalMessage" style="margin-bottom: 2em;">
      If you think this app is awesome, show your love by heading over to the Chrome webstore and rating it!
    </h4>
    <div class="footer" style="width: 400px; margin-bottom: 1em;">
      <table class="table">
    	<tr>
    	  <td class="borderless">
    		<input type="button" id="btnRateNever" name="btnRateNever" value="Never" />
    	  </td>
    	  <td  class="alignRight borderless">
    		<input type="button" id="btnRateLater" name="btnRateLater" value="Maybe Later" />
    		<input type="button" id="btnRateNow" name="btnRateNow" value="Sure!" />
    	  </td>
    	</tr>
      </table>
    </div>
    </div>
  </div>
  
  <div class="container">
    <h1 class="pageHeader">
      <img src="https://lh3.googleusercontent.com/Xr-Mbc_43rX7r48JdQnd6WOLPnTrgFG1KaPMMZHHYz15uNeO97Lb5oAd5avGvFMVMId70uIS=s50-h50-e365-rw" class="headerImage" />
      OOTO Scheduler Settings
    </h1>
    <div id="plsWaitAlert" name="plsWaitAlert" class="headerMsg">
      Please wait while the settings load...
    </div>

    <div>
      <table class="table borderless">
        <tr>
          <td class="settingsNameCol borderless">
            <span class="settingTitle">Enabled</span>
          </td>
          <td class="settingsValueCol alignRight borderless"><input type="checkbox" name="appEnabled" id="appEnabled" /></td>
        </tr>

        <tr>
          <td class="settingsNameCol borderless">
            <span class="settingTitle">Event title</span>
            <p>Enter a search string to use to determine whether the scanner should reply to new messages (ex. OOTO)</p>
          </td>
          <td class="alignRight borderless"><textarea type="textarea" rows="5" name="calendarEventTitle" id="calendarEventTitle" class="inputField"></textarea></td>
        </tr>
        
        <tr>
          <td class="settingsNameCol borderless">
            <span class="settingTitle">Email filter</span>
            <p>
              Enter any filter parameters you wish to apply, following Gmail's filter syntax. Note that some filters are applied automatically, such as
              trashed messages, date ranges, notes to self, category filters, and common "noreply" emails More info at
              <a href="https://support.google.com/mail/answer/7190?hl=en">https://support.google.com/mail/answer/7190?hl=en</a>
            </p>
          </td>
          <td class="alignRight borderless"><textarea type="textarea" rows="10" name="emailFilter" id="emailFilter" class="inputField"></textarea></td>
        </tr>

        <tr>
          <td class="settingsNameCol borderless"><input type="button" id="btnUninstall" name="btnUninstall" value="Uninstall OOTO Scheduler" /></td>
          <td class="alignRight borderless"><input type="submit" id="btnSave" name="btnSave" value="Save" /></td>
        </tr>
      </table>
    </div>

    <div id="debugLog" class="hidden"></div>

    <div class="footer" style="width: 800px;">
    <hr />
      <table class="table">
        <tr>
          <td class="borderless">
            <p>&#169; <a href="http://www.matthewpwatkins.com">Matthew Watkins</a></p>
          </td>

          <td class="alignRight borderless">
            <p>
              <!--<a href="http://www.matthewpwatkins.com/gmailsnooze" target="_blank">Documentation</a> |-->
              <a href="https://script.google.com/d/1FoeclPwMGY8-eRBWQAKQYl2pk_H9OjaDTlbzMxqNyHC5qfrs1watHooo/edit?usp=sharing" target="_blank">Source code</a> |
              <a id="rateLink" href="#">Rate this app</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </div>
  
  <!-- Use a templated HTML printing scriptlet to import JavaScript. -->
  <?!= HtmlService.createHtmlOutputFromFile('JavaScript').getContent(); ?>
  
  </body>
</html>