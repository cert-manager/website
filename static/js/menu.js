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

$(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
        $('#header nav').css({
            "height": "90px",
            "padding-top": "20px",
            "padding-bottom": "20px"
        });
    } else {
        $('#header nav').css({
            "height": "100px",
            "padding-top": "25px",
            "padding-bottom": "25px"
        });
    }
});
