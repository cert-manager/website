var inputs = $(
  ".subscriptions-form__form .mauticform-input, .subscriptions-form__form .mauticform-textarea"
);

inputs.on("blur", function() {
  if (this.value !== "") {
    $(this).addClass("subscription-form__input--has-value");
  } else {
    $(this).removeClass("subscription-form__input--has-value");
  }
});
