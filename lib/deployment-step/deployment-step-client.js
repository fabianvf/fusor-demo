window.fusor.displayDeploymentStepState = function (appName) {
  $('#deploymentStepClient').html(
    '<h1 class="step-title">' + appName + ' app loaded <span class="pficon pficon-delete delete-step-icon"></span> </h1>' +
    '<h4>Pre-Install State:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.preInstallState, null, 2) + '</pre>' +
    '<h4>Options:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.options, null, 2) + '</pre>' +
    '<h4>Post-Install State:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.postInstallState, null, 2) + '</pre>' +
    '<h4>Errors:</h4>' +
    '<pre>' + JSON.stringify(window.fusor.validation, null, 2) + '</pre>');

  $(document).on('click', 'span.delete-step-icon', function (event) {
    event.preventDefault();
    console.log(event);
    var url = location.pathname;
    $.ajax({
      type: 'DELETE',
      url: url,
      dataType: 'json',
      success: function (response) {
        let pathSegments = location.pathname.split('/');
        console.log(pathSegments);
        let stepNumber = parseInt(pathSegments[pathSegments.length - 1], 10) - 1;
        if (stepNumber > 0) {
          pathSegments[pathSegments.length - 1] = stepNumber;
          window.location.replace(pathSegments.join('/'));
        } else {
          window.location.replace('/deployments/' + pathSegments[2]);
        }
      },
      error: function (error) {
        console.log('error deleting deployment step', error);
      },
      data: {}
    });
  });
};