<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script>
    $(function () {
        // Load the settings and display them on the page
		google.script.run
		.withSuccessHandler(function (settings) {
            populateSettingsFields(settings);
            var now = new Date();
            if (settings.nextRatingPromptDate == null || settings.nextRatingPromptDate <= now) {
              // Time to annoy them with a modal
              $('#modalContainer').show();
            }
			showAlertMessage('Settings loaded successfully');
		}).withFailureHandler(function (err) {
            showAlertMessage('Error loading settings: \"' + err + '.\" Please wait a moment, refresh your browser, and try again');
		}).getOrCreateSettings();
        
        // Attach an event to the rate link
        $('#rateLink').click(function() {
          $('#modalContainer').show();
        });
        
        // Attach an event to the rate now button
        $('#btnRateNow').click(function() {
          window.open('https://chrome.google.com/webstore/detail/ooto-scheduler/feiknodbimkndjjeldljfjlcleehpmda/reviews', '_blank');
          google.script.run
          .withSuccessHandler(function() {
            showAlertMessage('Thanks!');
            $('#modalContainer').hide();
		  })
          .setNextRatingPromptDate(-1);
        });
        
        // Attach an event to the rate later button
        $('#btnRateLater').click(function() {
          google.script.run
          .withSuccessHandler(function() {
            showAlertMessage('Maybe later? OK, sure.');
            $('#modalContainer').hide();
		  })
          .setNextRatingPromptDate(7);
        });
        
        // Attach an event to the rate never button
        $('#btnRateNever').click(function() {
          google.script.run
          .withSuccessHandler(function() {
            showAlertMessage('Ouch, that really hurt');
            $('#modalContainer').hide();
		  })
          .setNextRatingPromptDate(-1);
        });
        
        // Attach an event to the unintall button
        $('#btnUninstall').click(function() {                
          if (confirm('Are you sure you want to completelty uninstall OOTO Scheduler from your account?')) {
            window.location.href = "https://script.google.com/macros/d/Mg4OhKGSVW_g55mWqREFu0wPAnCuUMyA7/manage/uninstall";
          }
        });

		// Attach an event to the save button
		$('#btnSave').click(function () {
			showAlertMessage('Saving settings. This may take a few moments. Please wait...');
			google.script.run
			.withSuccessHandler(function (settings) {
				populateSettingsFields(settings);
				showAlertMessage('Settings saved successfully');
			})
			.withFailureHandler(function (err) {
                showAlertMessage('Error saving settings: \"' + err + '.\" Please fix any errors and try again.');
			})
			.validateAndSetSettings(parseFromSettingsFields());
		});
	});

	function parseFromSettingsFields() {
		return {
			appEnabled : $('#appEnabled').prop('checked'),
			calendarEventTitle : $('#calendarEventTitle').val(),
			emailFilter : $('#emailFilter').val()
		};
	}

	function populateSettingsFields(settings) {
		$('#appEnabled').prop('checked', settings.appEnabled);
		$('#calendarEventTitle').val(settings.calendarEventTitle || '');
		$('#emailFilter').val(settings.emailFilter || '');
	}

	function showAlertMessage(text) {
		$('#plsWaitAlert').text(text);
	}
</script>