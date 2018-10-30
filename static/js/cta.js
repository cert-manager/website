// Redirect from the new CTA form to the existing contact us page and passes the email address in the URL
$(".cta__form").on("submit", function(e) {
  e.preventDefault();
  var email = $(".cta__email").val();

  if (email) {
    window.location = "/contact?email=" + email;
  }
});
