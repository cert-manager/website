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

var isHomepage = $('#header nav').hasClass('homepage');
var headerNav = $('#header nav');

$(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
        if(isHomepage) {
            headerNav.removeClass('homepage');
        }
    } else {
        if (isHomepage){
            headerNav.addClass('homepage');
        }
    }
});
