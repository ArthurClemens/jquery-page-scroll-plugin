jQuery(document).ready(function($) {
    
    if (location.hash) {
        // hide body before forcing to top
        $('body').hide();
        // secretly go to top
        window.scrollTo(0, 0);
    }
    
    $(window).pageScroll({
        id: location.hash,
        event: 'load hashchange',
        speed: 700,
        maxDuration: 2000,
        willScroll: function(opts) {
            if ($('body').is(':hidden')) {
                $('body').show();
            }
        },
        willScrollDelay: 500
    });
    
    $('a').pageScroll();
    
    $('a.special').pageScroll({
        duration: 2000
    });
    
    $('a.target').pageScroll({
        target: $('#target')
    });
    
    $('a.mouseover').pageScroll({
        target: $('#target'),
        event: 'mouseover'
    });
    
    $('a.beforeafter').pageScroll({
        willScroll: function(opts) {
            alert("before scroll; duration=" + opts.duration);
            // speed up
            opts.duration = 200;
        },
        willScrollDelay: 600,
        didScroll: function(opts) {
            alert("after scroll; duration=" + opts.duration);
        },
        didScrollDelay: 600
    });
    
    $('a.stop').pageScroll({
        mayScroll: function(opts) {
            var stop = confirm("Stop scrolling?");
            if (stop) {
                return false;
            } else {
                return true;
            }
        }
    });
    
});