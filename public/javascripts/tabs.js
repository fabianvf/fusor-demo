$(document).ready(function () {
  $(document).on("click", ".add-step-link", function (event) {
    event.preventDefault();
    var url = window.location.pathname.match(/\/deployments\/[a-z0-9]*/)[0] + '/steps';
    $.ajax({
      type: "POST",
      url: url,
      dataType: "json",
      success: function (response) {
        window.location.href = url + '/' + response.step.humanIndex;
      },
      error: function (error) {
        console.log('error adding step', error);
      },
      data: {}
    });
  });
});