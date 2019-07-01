$('#navbar, #dynamic-nav').on('show.bs.collapse', function () {
    $(this).closest('.navbar').addClass('opened');
});

$('#navbar, #dynamic-nav').on('hidden.bs.collapse', function () {
    $(this).closest('.navbar').removeClass('opened');
});

$(window).resize(function () {
    var nav = $('#navbar, #dynamic-nav');
    if ($(window).width() <= 768 && nav.hasClass('in')) {
        nav.closest('.navbar').addClass('opened');
    } else {
        nav.closest('.navbar').removeClass('opened');
    }
});

$(document).ready(function(){
  var headerNav = $('#header nav');

  if(headerNav.hasClass('homepage')) {
    $(window).scroll(function () {
      if ($(window).scrollTop() > 100) {
        headerNav.removeClass('homepage');
      } else {
        headerNav.addClass('homepage');
      }
    });
  }
});
