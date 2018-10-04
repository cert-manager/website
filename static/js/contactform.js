var searchParams = new URLSearchParams(window.location.search);
var email = searchParams.get("email");
if (email) {
  $('[type="email"]').val(email);
}
