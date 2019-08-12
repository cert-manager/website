$(document).ready(function () {
  var headerNav = $('[data-fade-scroll]');
  var applyScroll = function () {
    if ($(window).scrollTop() > 100) {
      headerNav.addClass('Navbar--solid');
    } else {
      headerNav.removeClass('Navbar--solid');
    }
  }

  applyScroll();

  $(window).scroll(applyScroll);
});

$(document).ready(function setupNavigation() {
  var toggleButton = $('[data-nav-toggle]');
  var navbar = $('[data-nav]');
  var topLevelNavbar = $('[data-top-nav]');

  toggleButton.on('click', function toggleMenu() {
    var isClosed = navbar.attr('aria-expanded');

    if (isClosed === 'false') {
      navbar.removeClass('Navbar__menu--isClosed');
      topLevelNavbar.addClass('Navbar--navOpen');
      navbar.attr('aria-expanded', true);
      toggleButton.attr('aria-expanded', true);
    } else {
      navbar.addClass('Navbar__menu--isClosed');
      topLevelNavbar.removeClass('Navbar--navOpen');
      navbar.attr('aria-expanded', false);
      toggleButton.attr('aria-expanded', false);
    }
  });
});