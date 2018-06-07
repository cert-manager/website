$(function () {
  // Initialised the smooth scroll anchors. Makes use of w3c standard with polyfill fallback
  initSmoothScroll();
});

function initSmoothScroll() {
  var triggers = document.querySelectorAll('[data-smooth-scroll]');
  triggers.forEach(function(trigger){
      trigger.addEventListener('click', function(event) {
          event.preventDefault();
          var target = document.querySelector(this.getAttribute('href'));
          var targetTop = target.offsetTop;
          window.scrollTo({ top:targetTop, behavior: 'smooth' });
      })
  });
}