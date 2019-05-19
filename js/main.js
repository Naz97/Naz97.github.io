$('.carousel').carousel({
    interval: 3000,
});
var wow = new WOW({
    boxClass:     'wow',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       0,          // distance to the element when triggering the animation (default is 0)
    mobile:       true,       // trigger animations on mobile devices (default is true)
    live:         true,       // act on asynchronously loaded content (default is true)
    callback:     function(box) {
      // the callback is fired every time an animation is started
      // the argument that is passed in is the DOM node being animated
    },
    scrollContainer: null,    // optional scroll container selector, otherwise use window,
    resetAnimation: true,     // reset animation on end (default is true)
});
wow.init();
// scrollspy
//$('body').scrollspy({
//    target: '.nav-top',
//    offset: 120
//});
// scroll to element
$('.scroll').on('click', function(e) {
    e.preventDefault();
    var selector,
    delay = 600;
    // target
    if (this.hash !== '') {
        selector = this.hash;
    } else if ($(this).data('scroll-target')) {
        selector = $(this).data('scroll-target');
    } else {
        return false;
    }
    // delay
    if ($(this).data('scroll-delay')) {
        delay = $(this).data('scroll-delay');
    }
    // call function
    smoothScrolling(selector, delay);
});

/* functions */
// smoothScrolling
function smoothScrolling(selector, delay) {
    $('html, body').animate( {
        scrollTop: $(selector).offset().top,
    }, delay);
}

