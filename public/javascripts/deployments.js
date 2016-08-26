$(document).ready(function () {
  $(document).on("click", ".delete-deployment-button", function (event) {
    event.preventDefault();
    console.log(event);
    var url = this.getAttribute('data-deployment-link');
    $.ajax({
      type: "DELETE",
      url: url,
      dataType: "json",
      success: function (response) {
        location.reload(true);
      },
      error: function (error) {
        console.log('error deleting deployment step', error);
      },
      data: {}
    });
  });
});