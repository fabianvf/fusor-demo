$(document).ready(function () {
  $('.selectpicker').selectpicker();
});

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