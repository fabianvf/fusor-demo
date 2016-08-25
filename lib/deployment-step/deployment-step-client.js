window.fusor.displayDeploymentStepState = function(appName) {
  $('#deploymentStepClient').html(
    '<h1 style="margin-bottom: 24px">' + appName + ' app loaded</h1>' +
    '<h4>Pre-Install State:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.preInstallState, null, 2) + '</pre>' +
    '<h4>Options:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.options, null, 2) + '</pre>' +
    '<h4>Post-Install State:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.postInstallState, null, 2) + '</pre>' +
    '<h4>Errors:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.validation, null, 2) + '</pre>');
}