var currentVersion = 4.0;

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
  .setTitle('OOTO Scheduler')
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
