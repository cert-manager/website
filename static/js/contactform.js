// Async contact form
$('form[id=contact-form]').submit(function(){
  $.post($(this).attr('action'), $(this).serialize(), function(data, textStatus, jqxhr){
    $('form[id=contact-form] #success').hide();
    $('form[id=contact-form] #error').hide();
    $('form[id=contact-form] #submit-contact').prop('disabled', true);
    if (jqxhr.status === 204) {
      $('form[id=contact-form] #success').show();
    }
    }).fail(function(){
    $('form[id=contact-form] #success').hide();
    $('form[id=contact-form] #error').hide();
    $('form[id=contact-form] #error').show();
  });
  return false;
});

// Contact form validation
$.validate({
  modules : 'html5, toggleDisabled'
});
