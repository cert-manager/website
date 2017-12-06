$(function () {
    adjustSettings();
    positionEvents();
});

$(window).resize(function () {
    adjustSettings();
    positionEvents();
});

var activeEvent = 0;

var startPosition = 50;
var incrementalPosition = 50;

function positionEvents() {
    $('.timeline-slider').css({left: - (activeEvent * incrementalPosition) + '%'});

    var positionDifferential = 0;
    $('.timeline-container').find('.event').each(function (index) {
        if (index == 0) {
            positionDifferential += startPosition;
        } else {
            positionDifferential += incrementalPosition;
        }

        $(this).css({left: positionDifferential + '%'});

        if (index === activeEvent) {
            $(this).removeClass('closed');
            $(this).addClass('open');
        }
    });
}

function timelineLeft() {
    if (activeEvent > 0) {
        $('.timeline-slider').animate({left: "+=" + incrementalPosition + "%"}, 400, 'linear');
        activeEvent--;
        activateNode();
    }
}

function timelineRight() {
    if (activeEvent < $('.timeline-slider .event').length - 1) {
        $('.timeline-slider').animate({left: "-=" + incrementalPosition + "%"}, 400, 'linear');
        activeEvent++;
        activateNode();
    }
}

function adjustSettings() {
    if ($(window).width() <= 768) {
        startPosition = 12.5;
        incrementalPosition = 100;
    } else {
        startPosition = 50;
        incrementalPosition = 50;
    }
}

function activateNode() {

    $('.timeline-container').find('.event.open').each(function (index) {
        $(this).removeClass('open');
        $(this).addClass('closed');
    });

    $('.timeline-container').find('.event').each(function (index) {
        if (index === activeEvent) {
            $(this).removeClass('closed');
            $(this).addClass('open');
        }
    });
}
