var inputs = $('.subscription-form__input');

inputs.on('blur', function() {
  if (this.value !== '') {
    $(this).addClass('subscription-form__input--has-value');
  } else {
    $(this).removeClass('subscription-form__input--has-value');
  }
});