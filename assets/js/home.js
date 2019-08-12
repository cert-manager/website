$(function () {
    var fader = $('[data-testimonial-fader]');
    var container = fader.find('.Testimonials__content');
    var delay = 15000;

    $(window).on('resize', () => applyHeight(container));
    applyHeight(container);

    window.setInterval(fade, delay, container);
});

function applyHeight($container) {
    const largestHeight = Math.max(...$container.find('.Testimonials__block').map(function getHeight(i, block) {
        return $(block).outerHeight();
    }));

    $container.height(largestHeight);
}

function fade($container) {
    var baseClass = 'Testimonials__block';
    var activeClass = baseClass + '--active';
    var hiddenClass = baseClass + '--hidden';
    var fadeTime = 500; // make sure this matches the CSS transition
    var activeSlide = $container.find('.' + activeClass);
    var nextSlide = activeSlide.next('.' + baseClass).length ? activeSlide.next('.' + baseClass) : $container.find('.' + baseClass).first();
    activeSlide.removeClass(activeClass);
    window.setTimeout(function addClassToNextSlide() {
        activeSlide.addClass(hiddenClass);
        nextSlide.removeClass(hiddenClass);
        nextSlide.addClass(activeClass);
    }, fadeTime);
}