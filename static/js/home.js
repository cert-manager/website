$(function () {
    popNav();
    $(window).scroll(function () {
        popNav();
    });

    $('#lead-image .video').vide({
        mp4: '/assets/shuttle.mp4',
        webm: '/assets/shuttle.webm',
        ogv: '/assets/shuttle.ogv',
        poster: '/assets/shuttle.png'
    }, {
        position: '50% 50%',
        muted: true,
        loop: true,
        autoplay: true,
        resizing: true
    });

    $('.carousel-control').click(function (e) {
        e.preventDefault();
        var goTo = $(this).data('slide');
        if (goTo == "prev") {
            $('#carousel').carousel('prev');
        } else {
            $('#carousel').carousel('next');
        }
    });


});

var activeSlide = 1;
var totalSlides = $('#carousel .item').length;

$('#carousel').on('slide.bs.carousel', function (carousel) {
    if (carousel.direction == "right") {
        activeSlide--;
        if (activeSlide < 1) {
            activeSlide = totalSlides
        }
    } else {
        activeSlide++;
        if (activeSlide > totalSlides) {
            activeSlide = 1
        }
    }

    var paddedTotalSlides = pad(totalSlides, 2);
    $('.pagination').html(activeSlide + "/" + paddedTotalSlides);
});

function popNav() {
    // If the scroll of the window is below one window height
    if ($(window).scrollTop() > $(window).height()) {
        // Pop the menu in
        $('#dynamic-nav').stop().animate({
            top: "0px"
        }, 50, 'linear');
    } else {
        // Hide the menu
        $('#dynamic-nav').stop().animate({
            top: "-100px"
        }, 50, 'linear');
    }
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
